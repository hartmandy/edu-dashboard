import { Enrollment, PreparedData, TimeBlockData } from "~/types"; // Assuming this is the correct import path

const convertToMinutes = (time: string): number => {
  const [_, hours, minutes, period] = time.match(/(\d+):(\d+)(AM|PM)/)!;
  let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  if (period === "PM" && parseInt(hours, 10) !== 12) totalMinutes += 12 * 60;
  if (period === "AM" && parseInt(hours, 10) === 12) totalMinutes -= 12 * 60;
  return totalMinutes;
};

export const prepareCourseData = (enrollments: Enrollment[]): PreparedData => {
  console.log("Received enrollments: ", enrollments);

  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const preparedData: PreparedData = {};

  daysOfWeek.forEach((day) => {
    preparedData[day] = [];
  });

  enrollments.forEach((enrollment) => {
    const { id, status, section } = enrollment;

    if (section && section.days) {
      const { startTime, endTime, days, course } = section;

      if (course) {
        const courseTitle = course.courseTitle;

        days.forEach(({ dayOfWeek }) => {
          if (daysOfWeek.includes(dayOfWeek.toUpperCase())) {
            const timeBlock: TimeBlockData = {
              startTime,
              endTime,
              courseTitle,
              id,
              status,
            };
            preparedData[dayOfWeek].push(timeBlock);
          }
        });
      }
    }
  });

  daysOfWeek.forEach((day) => {
    preparedData[day].sort((a, b) => {
      return convertToMinutes(a.startTime) - convertToMinutes(b.startTime);
    });
  });

  console.log("Prepared data: ", preparedData);

  return preparedData;
};
