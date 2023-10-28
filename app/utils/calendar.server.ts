type Section = {
  startTime: string;
  days: { dayOfWeek: string }[];
};

type Course = {
  courseTitle: string;
  sections: Section[];
};

type Enrollment = {
  course: Course;
};

type PreparedData = {
  [key: string]: { startTime: string; courseTitle: string }[];
};

const convertToMinutes = (time: string): number => {
  const [_, hours, minutes, period] = time.match(/(\d+):(\d+)(AM|PM)/)!;
  let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  if (period === "PM" && parseInt(hours, 10) !== 12) totalMinutes += 12 * 60;
  if (period === "AM" && parseInt(hours, 10) === 12) totalMinutes -= 12 * 60;
  return totalMinutes;
};

export const prepareCourseData = (enrollments: Enrollment[]): PreparedData => {
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const preparedData: PreparedData = {};

  // Initialize empty arrays for each day of the week
  daysOfWeek.forEach((day) => {
    preparedData[day] = [];
  });

  // Loop through each enrollment to populate the preparedData
  enrollments.forEach(({ course }) => {
    const { sections } = course;

    sections.forEach((section) => {
      const { startTime, days } = section;

      days.forEach(({ dayOfWeek }) => {
        if (daysOfWeek.includes(dayOfWeek.toUpperCase())) {
          preparedData[dayOfWeek].push({
            startTime,
            courseTitle: course.courseTitle,
          });
        }
      });
    });
  });

  // Sort by start time for each day
  daysOfWeek.forEach((day) => {
    preparedData[day].sort((a, b) => {
      return convertToMinutes(a.startTime) - convertToMinutes(b.startTime);
    });
  });

  return preparedData;
};
