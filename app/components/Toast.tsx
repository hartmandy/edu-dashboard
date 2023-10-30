import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

export function Toast({
  message,
  time = 5000,
}: {
  message: string;
  time?: number;
}) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed bottom-4 right-4  rounded-lg border border-gray-100 bg-white px-4 py-2 text-left text-sm font-medium shadow-lg">
        {message}
      </div>
    </Transition>
  );
}
