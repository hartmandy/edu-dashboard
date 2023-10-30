import { START_TIME, END_TIME, TIME_INCREMENT } from "./constants";
import { convertToMinutes } from "./helpers";

export default function TimeColumn() {
  let currentMinutes = convertToMinutes(START_TIME);
  const endMinutes = convertToMinutes(END_TIME);
  const timeSlots = [];

  while (currentMinutes <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const formattedTime = `${formattedHour}:${
      minutes === 0 ? "00" : minutes
    }${period}`;

    const borderClass =
      currentMinutes % 60 === 0
        ? "border-zinc-800 border-dashed"
        : " border-zinc-800 border-solid";

    timeSlots.push(
      <div
        key={currentMinutes}
        className={`relative h-[80px] p-2 border-b ${borderClass}`}
      >
        {formattedTime}
      </div>
    );

    currentMinutes += TIME_INCREMENT;
  }

  return (
    <div className="sticky left-0 z-30 border-r border-zinc-700 bg-zinc-900">
      <div className="py-6 text-center h-[73px] border-b border-zinc-700 bg-zinc-900 sticky z-30 top-0"></div>
      <div className="grid grid-rows-14 text-zinc-500">{timeSlots}</div>
    </div>
  );
}
