import { Cross1Icon } from "@radix-ui/react-icons";
import { convertToMinutes } from "./helpers";
import { TimeBlockData } from "~/types";
import { useFetcher } from "@remix-run/react";

interface TimeSlotProps {
  currentMinutes: number;
  foundCourse: TimeBlockData | undefined;
}

const TimeSlot = ({ currentMinutes, foundCourse }: TimeSlotProps) => {
  const deleteEnrollmentFetcher = useFetcher();

  const isFirstBlock = foundCourse
    ? convertToMinutes(foundCourse.startTime) === currentMinutes
    : false;
  const borderClass = Boolean(foundCourse)
    ? ""
    : currentMinutes % 60 === 0
    ? "dark:border-zinc-800 border-zinc-300 border-b border-dashed"
    : "dark:border-zinc-800 border-zinc-300 border-b border-solid";
  const color = Boolean(foundCourse)
    ? "dark:bg-blue-300 dark:text-black bg-blue-500 text-white"
    : "";
  const contentStyle = isFirstBlock ? "absolute inset-0" : "";

  return (
    <div
      key={currentMinutes}
      className={`relative last:border-b-0 ${borderClass} p-2 ${color} h-[80px] ${
        isFirstBlock ? "border-t dark:border-zinc-700 border-zinc-400" : ""
      }`}
    >
      <div
        className={`p-2 z-10 flex items-start justify-between gap-1 ${contentStyle}`}
      >
        <div>
          {isFirstBlock && (
            <p className="text-lg font-semibold">{foundCourse?.courseTitle}</p>
          )}
          {isFirstBlock && (
            <p>{`${foundCourse?.startTime} - ${foundCourse?.endTime}`}</p>
          )}
        </div>
        {isFirstBlock && foundCourse?.status === "DRAFT" ? (
          <deleteEnrollmentFetcher.Form
            method="POST"
            action={`/delete-enrollment/${foundCourse?.id}`}
          >
            {deleteEnrollmentFetcher.state === "idle" ? (
              <button>
                <Cross1Icon height={20} width={20} />
              </button>
            ) : (
              ".."
            )}
          </deleteEnrollmentFetcher.Form>
        ) : null}
      </div>
    </div>
  );
};

export default TimeSlot;
