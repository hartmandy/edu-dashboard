import OpenAI from "openai";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { getAllCourses } from "~/data/enrollment.server";
import { getStudentEnrollments } from "~/data/student.server";
import Markdown from "~/components/Markdown";
import Loader from "~/components/Loader";
import useChatbot from "~/utils/chatbot.hook";

export const action = async ({ request }: ActionFunctionArgs) => {
  const enrollments = await getStudentEnrollments();
  const allCourses = await getAllCourses();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const formData = await request.formData();
  const chatThread = JSON.parse(formData.get("chatThread") as string);
  const content = (await formData.get("content")) as string;
  if (!content || !chatThread) {
    return {
      content: null,
      error: "No content.",
    };
  }

  const result = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: getSystemPrompt(enrollments, allCourses),
      },
      ...chatThread,
      { role: "user", content: content },
    ],
    model: "ft:gpt-3.5-turbo-1106:personal::8JweN5TR",
  });

  return {
    content: result.choices[0].message.content,
    error: null,
  };
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { response, formRef, fetcher } = useChatbot();
  const fetcherIsLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";

  const messagesRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [response]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        event.target !== containerRef.current
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-0 right-0 z-20 transition-all ease-in-out duration-200 shadow-xl ${
        isOpen
          ? "max-w-xl h-[704px] bg-zinc-100 text-zinc-950 border"
          : " max-w-[64px] h-[64px] bg-blue-600 text-white rounded-full animate-breathe"
      } w-full`}
    >
      <div
        className={`p-6 ${
          isOpen ? "border-zinc-300 border-b" : ""
        } cursor-pointer`}
        onClick={toggleOpen}
      >
        {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
      </div>
      {isOpen && (
        <>
          <div className="overflow-auto h-[400px]" ref={messagesRef}>
            {response.map((message: any, index: number) => (
              <div
                key={index}
                className={`${
                  message.role === "assistant" ? "text-left" : "text-right"
                }`}
              >
                <div className="border-b border-zinc-300 p-6 whitespace-pre-wrap overflow-x-hidden break-words">
                  {message.role === "assistant" ? (
                    <strong className="mr-2 text-lg">Assistant</strong>
                  ) : null}
                  {message.role === "user" ? (
                    <strong className="ml-2 text-lg">You</strong>
                  ) : null}
                  <Markdown response={message.content} />
                </div>
              </div>
            ))}
            {fetcherIsLoading ? <Loader /> : null}
          </div>
          <fetcher.Form
            method="POST"
            action="/chatbot"
            ref={formRef}
            className="p-6 grid gap-4"
          >
            <textarea
              name="content"
              rows={3}
              className="text-zinc-950 bg-zinc-200 p-4 border border-zinc-300 w-full text-lg"
              placeholder="Ask me about course details, schedule building, potential conflicts, or suggestions for courses to take."
            />
            <input
              type="hidden"
              name="chatThread"
              value={JSON.stringify(response)}
            />
            <button className="bg-blue-500 h-14 px-6 hover:bg-blue-600 font-semibold text-white">
              Send
            </button>
          </fetcher.Form>
        </>
      )}
    </div>
  );
};

function getSystemPrompt(enrollments: string, allCourses: string) {
  const data = ` 
    Students current schedule JSON: 
    
    ${enrollments}
    
    All the courses we offered JSON:

    ${allCourses}
    `;

  const rules = `You are a assistant aiding students with selecting courses for their semester.
    The are tasked with this:

    1. Help the user with information about the courses offered. 
    2. Most importantly always consider the time conflict between the course the user is asking about and their current schedule, you must always check. 
    3. You will address the user as Mandy.
    4. Respond with Markdown.

    You cannot: 
    1. Register a user for a course. 
    2. Talk about unrelated topics.
    
    `;

  return `
  ${rules}
  
  ${data}
  `;
}
