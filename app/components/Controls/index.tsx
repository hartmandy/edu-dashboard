import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { MouseEventHandler } from "react";

type Props = {
  isOpen: boolean;
  toggleOpen: MouseEventHandler<HTMLDivElement>;
};

export default function Controls({ isOpen, toggleOpen }: Props) {
  return (
    <div
      className={`p-6 ${
        isOpen ? "border-zinc-300 border-b" : ""
      } cursor-pointer`}
      onClick={toggleOpen}
    >
      {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
    </div>
  );
}
