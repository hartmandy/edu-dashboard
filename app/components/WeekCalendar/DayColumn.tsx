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
        className={`sticky top-0 py-6 text-center border-b ${
          isFriday ? "" : "border-r"
        } border-zinc-700 bg-zinc-900 z-20`}
      >
        {day}
      </div>
      <div className={`${isFriday ? "" : "border-r border-zinc-800"}`}>
        {timeSlots}
      </div>
    </div>
  );
};
