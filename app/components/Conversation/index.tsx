import { useRef, useEffect } from "react";
import { Message } from "~/types";
import Markdown from "../Markdown";
import Loader from "../Loader";

type Props = { messages: Message[]; isLoading: boolean };

export default function index({ messages, isLoading }: Props) {
  const messagesRef = useRef<any>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="overflow-auto h-[400px]" ref={messagesRef}>
      {messages.map((message: any, index: number) => (
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
            <Markdown message={message.content} />
          </div>
        </div>
      ))}
      {isLoading ? <Loader /> : null}
    </div>
  );
}
