// useChatbot.ts
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Message } from "~/types";

export default function useChatbot() {
  const formRef = useRef<any>();
  const [response, setResponse] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey, Mandy - Welcome to CourseQueue Ai! How can I help you today?",
    },
  ]);
  const fetcher = useFetcher<any>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.content) {
      setResponse((prev) => [
        ...prev,
        { role: "assistant", content: fetcher.data?.content! },
      ]);
    }
    if (fetcher.state === "submitting") {
      const userContent = formRef.current.content.value;
      setResponse((prev) => [...prev, { role: "user", content: userContent }]);

      formRef.current.reset();
    }
  }, [fetcher]);

  return { response, formRef, fetcher };
}
