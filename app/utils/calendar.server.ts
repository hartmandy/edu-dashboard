type Section = {
  startTime: string;
  endTime: string;
  days: { dayOfWeek: string }[];
};

type Course = {
  courseTitle: string;
  sections: Section[];
  id: number;
};

type Enrollment = {
  id: number;
  course: Course;
};

type PreparedData = {
  [key: string]: {
    startTime: string;
    endTime: string;
    courseTitle: string;
    id: number;
  }[];
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
  enrollments.forEach(({ id, course }) => {
    const { sections } = course;

    // Add the enrollment id to the course object
    course.id = id;

    sections.forEach((section) => {
      const { startTime, days, endTime } = section;

      days.forEach(({ dayOfWeek }) => {
        if (daysOfWeek.includes(dayOfWeek.toUpperCase())) {
          preparedData[dayOfWeek].push({
            startTime,
            endTime,
            courseTitle: course.courseTitle,
            id: id,
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
