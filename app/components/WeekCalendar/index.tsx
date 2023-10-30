import { DayColumn } from "./DayColumn";
import TimeColumn from "./TimeColumn";
import { PreparedData } from "~/types";

const WeekCalendar = ({ preparedData }: { preparedData: PreparedData }) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return (
    <div className="flex w-screen border-b border-b-zinc-800">
      <TimeColumn />
      <div className="grid grid-cols-5 w-full">
        {daysOfWeek.map((day) => (
          <DayColumn
            key={day}
            day={day}
            timeBlocks={preparedData[day.toUpperCase()] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
