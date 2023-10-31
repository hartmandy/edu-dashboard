import { DayColumn } from "./DayColumn";
import TimeColumn from "./TimeColumn";
import { ScheduleData } from "~/types";

const WeekCalendar = ({ scheduleData }: { scheduleData: ScheduleData }) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  console.log({ scheduleData });
  return (
    <div className="flex w-screen border-b border-b-zinc-800">
      <TimeColumn />
      <div className="grid grid-cols-5 w-full border-r dark:border-zinc-700 border-zinc-400">
        {daysOfWeek.map((day) => (
          <DayColumn
            key={day}
            day={day}
            timeBlocks={scheduleData[day.toUpperCase()] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
