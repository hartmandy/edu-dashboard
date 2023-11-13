import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { getAllCourses } from "~/data/enrollment.server";
import { getStudentEnrollments } from "~/data/student.server";
import useChatbot from "~/utils/chatbot.hook";
import Conversation from "~/components/Conversation";
import Controls from "~/components/Controls";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const chatThread = JSON.parse(formData.get("chatThread") as string);
  const userInput = (await formData.get("userInput")) as string;

  if (!userInput || !chatThread) {
    return {
      content: null,
      error: "No content.",
    };
  }

  const enrollments = await getStudentEnrollments();
  const allCourses = await getAllCourses();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // prepare the system message, the previous chat thread, and the new question.
  const messages = [
    {
      role: "system",
      content: getSystemPrompt(enrollments, allCourses), // give gpt-3.5 the context of the students enrollments and all courses on the platform.
    },
    ...chatThread,
    { role: "user", content: userInput },
  ];

  //Make a request to the openai chat completions endpoint and get the message content.
  const result = await openai.chat.completions.create({
    messages: messages,
    model: "ft:gpt-3.5-turbo-1106:personal::8JweN5TR",
  });

  const [choice] = result.choices;

  return {
    content: choice.message.content,
    error: null,
  };
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, formRef, fetcher, isLoading } = useChatbot();
  const containerRef = useRef<any>(null);

  useEffect(() => {
    // Close the ai conversation form if the user clicks outside the ui.
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

  const openCloseStyles = isOpen
    ? "max-w-xl h-[704px] bg-zinc-100 text-zinc-950 border"
    : " max-w-[64px] h-[64px] bg-blue-600 text-white rounded-full animate-breathe";

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-0 right-0 z-20 transition-all ease-in-out duration-200 shadow-xl w-full ${openCloseStyles}`}
    >
      {/* Ai open/close controls */}
      <Controls isOpen={isOpen} toggleOpen={toggleOpen} />

      {isOpen && (
        <>
          {/* Ai/User conversation */}
          <Conversation messages={messages} isLoading={isLoading} />

          {/* User input form */}
          <fetcher.Form
            method="POST"
            action="/chatbot"
            ref={formRef}
            className="p-6 grid gap-4"
          >
            <textarea
              name="userInput"
              rows={3}
              className="text-zinc-950 bg-zinc-200 p-4 border border-zinc-300 w-full text-lg"
              placeholder="Ask me about course details, schedule building, potential conflicts, or suggestions for courses to take."
            />
            <input
              type="hidden"
              name="chatThread"
              value={JSON.stringify(messages)}
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
    Students current schedule: 
    
    ${enrollments}
    
    All the courses we offered:

    ${allCourses}
    `;

  const rules = `You are a assistant aiding students with selecting courses for their semester.
    The are tasked with this:

    1. Help the user with information about the courses offered. 
    2. Most importantly always consider the time conflict between the course the user is asking about and their current schedule, you must always check. 
    3. You will address the user as Amanda.
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
