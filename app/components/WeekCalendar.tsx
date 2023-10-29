import { Cross1Icon } from "@radix-ui/react-icons";
import { useFetcher, Form } from "@remix-run/react";
type PreparedData = {
  [key: string]: TimeBlockData[];
};

type TimeBlockData = { startTime: string; courseTitle: string; id: number };
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
      (block) => convertToMinutes(block.startTime) === currentMinutes
    );
    const blockContent = foundCourse ? foundCourse.courseTitle : null;
    const time = foundCourse ? foundCourse.startTime : null;
    const action = foundCourse ? (
      <deleteEnrollmentFetcher.Form
        method="POST"
        action={`/delete-enrollment/${foundCourse.id}`}
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

    const borderClass =
      currentMinutes % 60 === 0 ? "border-solid" : "border-dashed";

    const color = Boolean(blockContent) ? "bg-indigo-300 text-black" : "";
    timeSlots.push(
      <div
        key={currentMinutes}
        className={`relative border-zinc-800 border-b ${borderClass} h-[80px] p-2 ${color}`}
      >
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className="text-md">{blockContent}</p>
            <p>{time}</p>
          </div>
          {action}
        </div>
      </div>
    );

    currentMinutes += TIME_INCREMENT;
  }

  return (
    <div className="border-r-zinc-800 border-r">
      <div className="sticky top-0 py-6 text-center border-b border-r border-zinc-800 bg-zinc-900 z-10">
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
      <div className="sticky left-0 z-20 bg-zinc-900 border-r border-zinc-800">
        <div className="py-6 text-center h-[73px] border-b border-zinc-800"></div>
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
