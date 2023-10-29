import { Cross1Icon } from "@radix-ui/react-icons";
import { useFetcher, Form } from "@remix-run/react";
type PreparedData = {
  [key: string]: TimeBlockData[];
};

type TimeBlockData = {
  startTime: string;
  endTime: string;
  courseTitle: string;
  id: number;
};
const START_TIME = "8:00AM";
const END_TIME = "10:00PM";
const TIME_INCREMENT = 30;

const convertToMinutes = (time: string): number => {
  const [_, hours, minutes, period] = time.match(/(\d+):(\d+)(AM|PM)/)!;
  let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  if (period === "PM" && parseInt(hours, 10) !== 12) totalMinutes += 12 * 60;
  if (period === "AM" && parseInt(hours, 10) === 12) totalMinutes -= 12 * 60;
  return totalMinutes;
};

const DayColumn = ({
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

    const action = isFirstBlock ? (
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
        className={`relative ${borderClass} p-2 ${color} h-[80px]`}
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
      <div className="sticky top-0 py-6 text-center border-b border-r border-zinc-800 bg-zinc-900 z-20">
        {day}
      </div>
      <div>{timeSlots}</div>
    </div>
  );
};

const WeekCalendar = ({ preparedData }: { preparedData: PreparedData }) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const renderTimeColumn = () => {
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
        currentMinutes % 60 === 0 ? "border-solid" : "border-dashed";

      timeSlots.push(
        <div
          key={currentMinutes}
          className={`relative h-[80px] p-2 border-b border-zinc-800 ${borderClass}`}
        >
          {formattedTime}
        </div>
      );

      currentMinutes += TIME_INCREMENT;
    }

    return (
      <div className="sticky left-0 z-20 border-r border-zinc-800 bg-zinc-900">
        <div className="py-6 text-center h-[73px] border-b border-zinc-800 sticky top-0 bg-zinc-900 z-20"></div>
        <div className="grid grid-rows-14">{timeSlots}</div>
      </div>
    );
  };

  return (
    <div className="flex w-screen">
      {renderTimeColumn()}
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
