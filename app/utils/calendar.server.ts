import { Enrollment, ScheduleData, TimeBlockData } from "~/types"; // Assuming this is the correct import path

const convertToMinutes = (time: string): number => {
  const [_, hours, minutes, period] = time.match(/(\d+):(\d+)(AM|PM)/)!;
  let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  if (period === "PM" && parseInt(hours, 10) !== 12) totalMinutes += 12 * 60;
  if (period === "AM" && parseInt(hours, 10) === 12) totalMinutes -= 12 * 60;
  return totalMinutes;
};

// This function prepares data for a single day
const prepareDayData = (
  enrollments: Enrollment[],
  day: string
): TimeBlockData[] => {
  return enrollments
    .filter((enrollment) =>
      enrollment.section?.days?.some((d) => d.dayOfWeek.toUpperCase() === day)
    )
    .map((enrollment) => ({
      startTime: enrollment.section?.startTime!,
      endTime: enrollment.section?.endTime!,
      courseTitle: enrollment.section?.course?.courseTitle!,
      id: enrollment.id,
      status: enrollment.status,
    }))
    .sort(
      (a, b) => convertToMinutes(a.startTime) - convertToMinutes(b.startTime)
    );
};

export const prepareScheduleData = (
  enrollments: Enrollment[]
): ScheduleData => {
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const preparedData: ScheduleData = {};

  daysOfWeek.forEach((day) => {
    preparedData[day] = prepareDayData(enrollments, day);
  });

  return preparedData;
};
