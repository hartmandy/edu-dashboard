import { TIME_INCREMENT, START_TIME, END_TIME } from "./constants";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { convertToMinutes } from "./helpers";

type TimeBlockData = {
  startTime: string;
  endTime: string;
  courseTitle: string;
  id: number;
  status: "DRAFT" | "ENROLLED";
};

export const DayColumn = ({
  day,
  timeBlocks,
}: {
  day: string;
  timeBlocks: TimeBlockData[];
}) => {
  const deleteEnrollmentFetcher = useFetcher();
  let currentMinutes = convertToMinutes(START_TIME);
  const endMinutes = convertToMinutes(END_TIME);
  const timeSlots = [];

  while (currentMinutes <= endMinutes) {
    const foundCourse = timeBlocks.find(
      (block) =>
        convertToMinutes(block.startTime) <= currentMinutes &&
        convertToMinutes(block.endTime) > currentMinutes
    );

    const isFirstBlock = foundCourse
      ? convertToMinutes(foundCourse.startTime) === currentMinutes
      : false;

    const duration = foundCourse
      ? convertToMinutes(foundCourse.endTime) -
        convertToMinutes(foundCourse.startTime)
      : 0;

    const rowNum =
      Math.floor(
        (currentMinutes - convertToMinutes(START_TIME)) / TIME_INCREMENT
      ) + 1;
    const rowSpan = Math.floor(duration / TIME_INCREMENT);

    const gridRow = isFirstBlock
      ? `grid-row: ${rowNum} / span ${rowSpan};`
      : "";

    const contentStyle = isFirstBlock ? "absolute inset-0" : "";

    const action =
      isFirstBlock && foundCourse?.status === "DRAFT" ? (
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
      ) : null;

    const borderClass = Boolean(foundCourse)
      ? ""
      : currentMinutes % 60 === 0
      ? "border-zinc-800 border-b border-solid"
      : "border-zinc-800 border-b border-dashed";

    const color = Boolean(foundCourse) ? "bg-indigo-300 text-black" : "";

    timeSlots.push(
      <div
        key={currentMinutes}
        style={{ gridRow }}
        className={`relative ${borderClass} p-2 ${color} h-[80px] ${
          isFirstBlock ? "border-t border-zinc-800" : ""
        }`}
      >
        <div
          className={`p-2 z-10 flex items-start justify-between gap-1 ${contentStyle}`}
        >
          <div>
            {isFirstBlock && (
              <p className="text-lg">{foundCourse?.courseTitle}</p>
            )}
            {isFirstBlock && (
              <p>{`${foundCourse?.startTime} - ${foundCourse?.endTime}`}</p>
            )}
          </div>
          {isFirstBlock && action}
        </div>
      </div>
    );

    currentMinutes += TIME_INCREMENT;
  }

  return (
    <div className="border-r-zinc-800 border-r grid grid-rows-auto">
      <div className="sticky top-0 py-6 text-center border-b border-zinc-800 bg-zinc-900 z-20">
        {day}
      </div>
      <div>{timeSlots}</div>
    </div>
  );
};
