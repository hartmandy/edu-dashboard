// useChatbot.ts
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Message } from "~/types";

export default function useChatbot() {
  const formRef = useRef<any>();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi Amanda - Welcome to CourseQueue Ai! How can I help you today?",
    },
  ]);
  const fetcher = useFetcher<any>();
  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";
  useEffect(() => {
    // If the fetcher is idle again, and we have data from the fetcher (action/chatbot post)
    if (fetcher.state === "idle" && fetcher.data?.content) {
      // update the conversation ui with the new content.
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fetcher.data?.content! },
      ]);
    }

    // If the user submitted a new question for the ai
    if (fetcher.state === "submitting") {
      // add the question to the conversation ui.
      const userInput = formRef.current.userInput.value;
      setMessages((prev) => [...prev, { role: "user", content: userInput }]);
      // reset the form.
      formRef.current.reset();
    }
  }, [fetcher]);

  return { messages, formRef, fetcher, isLoading };
}
