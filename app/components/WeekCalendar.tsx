type PreparedData = {
  [key: string]: TimeBlockData[];
};

type TimeBlockData = { startTime: string; courseTitle: string };

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
  let currentMinutes = convertToMinutes("7:00AM");
  const endMinutes = convertToMinutes("3:00PM");

  const timeSlots = [];

  while (currentMinutes <= endMinutes) {
    const foundCourse = timeBlocks.find(
      (block) => convertToMinutes(block.startTime) === currentMinutes
    );
    const blockContent = foundCourse ? foundCourse.courseTitle : null;
    const time = foundCourse ? foundCourse.startTime : null;
    timeSlots.push(
      <div
        key={currentMinutes}
        className={`relative border-b border-r border-zinc-800 h-[80px] p-2 ${
          Boolean(blockContent) && "bg-indigo-300 text-black"
        }`}
      >
        <div>
          <p>{blockContent}</p>
          <p>{time}</p>
        </div>
      </div>
    );

    currentMinutes += 60;
  }

  return (
    <div>
      <div className="py-6 text-center border-b border-r border-zinc-800">
        {day}
      </div>
      <div className="grid grid-rows-14">{timeSlots}</div>
    </div>
  );
};

const WeekCalendar = ({ preparedData }: { preparedData: PreparedData }) => {
  const daysOfWeek = [
    " ",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const renderTimeColumn = () => {
    let currentMinutes = convertToMinutes("7:00AM");
    const endMinutes = convertToMinutes("2:00PM");
    const timeSlots = [];

    while (currentMinutes <= endMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const formattedTime = `${formattedHour}:${
        minutes === 0 ? "00" : minutes
      }${period}`;

      timeSlots.push(
        <div key={currentMinutes} className="relative  h-[80px] p-2">
          {formattedTime}
        </div>
      );

      currentMinutes += 60;
    }
    return (
      <div className="fixed">
        <div className="py-6 text-center h-[73px]"></div>
        <div className="grid grid-rows-14">{timeSlots}</div>
      </div>
    );
  };

  return (
    <div className="flex w-screen">
      {renderTimeColumn()}
      <div className="grid grid-cols-5 w-full">
        {daysOfWeek.slice(1).map((day) => (
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
