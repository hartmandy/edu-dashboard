const WeekCalendar = ({ enrollments }) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const convertToMinutes = (time) => {
    const [_, hours, minutes, period] = time.match(/(\d+):(\d+)(AM|PM)/);
    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    if (period === "PM" && parseInt(hours) !== 12) totalMinutes += 12 * 60;
    if (period === "AM" && parseInt(hours) === 12) totalMinutes -= 12 * 60;
    return totalMinutes;
  };

  const renderTimeBlocks = (dayOfWeek) => {
    let timeBlocks = [];
    let currentMinutes = convertToMinutes("7:00AM");
    const endMinutes = convertToMinutes("2:00PM");

    while (currentMinutes <= endMinutes) {
      const matchingCourse = enrollments.find(({ course }) => {
        const { sections } = course;
        return sections.some((section) => {
          const { startTime, days } = section;
          const startTimeInMinutes = convertToMinutes(startTime);
          return (
            currentMinutes === startTimeInMinutes &&
            days.some((day) => day.dayOfWeek === dayOfWeek.toUpperCase())
          );
        });
      });

      const blockContent = matchingCourse
        ? matchingCourse.course.courseTitle
        : null;

      timeBlocks.push(
        <div
          key={dayOfWeek + currentMinutes}
          className={`relative border-b border-r border-zinc-800 h-[80px] p-2 ${
            Boolean(matchingCourse) && "bg-indigo-300 text-black"
          }`}
        >
          {blockContent}
        </div>
      );

      currentMinutes += 60;
    }

    return timeBlocks;
  };

  return (
    <div className="grid grid-cols-5">
      {daysOfWeek.map((day) => (
        <div key={day}>
          <div className="py-6 text-center border-b border-r border-zinc-800">
            {day}
          </div>
          <div className="grid grid-rows-14 gap-1">{renderTimeBlocks(day)}</div>
        </div>
      ))}
    </div>
  );
};

export default WeekCalendar;
