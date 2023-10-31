import { TIME_INCREMENT, START_TIME, END_TIME } from "./constants";
import { convertToMinutes } from "./helpers";
import { TimeBlockData } from "~/types";
import TimeSlot from "./TimeSlot";

interface DayColumnProps {
  day: string;
  timeBlocks: TimeBlockData[];
}

export const DayColumn: React.FC<DayColumnProps> = ({ day, timeBlocks }) => {
  let currentMinutes = convertToMinutes(START_TIME);
  const endMinutes = convertToMinutes(END_TIME);
  const timeSlots = [];

  // generate time slots
  while (currentMinutes <= endMinutes) {
    const foundCourse = timeBlocks.find(
      (block) =>
        convertToMinutes(block.startTime) <= currentMinutes &&
        convertToMinutes(block.endTime) > currentMinutes
    );

    timeSlots.push(
      <TimeSlot
        key={currentMinutes}
        currentMinutes={currentMinutes}
        foundCourse={foundCourse}
      />
    );

    currentMinutes += TIME_INCREMENT;
  }

  const isFriday = day === "Friday";

  return (
    <div className="grid grid-rows-auto">
      <div
        className={`sticky font-light top-0 py-6 text-center border-b ${
          isFriday ? "" : "border-r"
        } dark:border-zinc-700 border-zinc-400 dark:bg-zinc-900 bg-zinc-50 z-20`}
      >
        {day}
      </div>
      <div
        className={`${
          isFriday ? "" : "border-r dark:border-zinc-800 border-zinc-300"
        }`}
      >
        {timeSlots}
      </div>
    </div>
  );
};
