import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { prepareScheduleData } from "~/utils/calendar.server";
import { getStudentWithDraftEnrollments } from "~/data/student.server";
import { ScheduleData } from "~/types";
import { json } from "@remix-run/node";

export const loader = async () => {
  const student = await getStudentWithDraftEnrollments();
  if (!student?.enrollments) {
    return { enrollments: null };
  }

  const scheduleData = prepareScheduleData(student?.enrollments || []);
  if (!scheduleData) {
    throw new Error("Failed to get prepared calendar data");
  }

  return json({ scheduleData });
};

export default function Calendar() {
  const { scheduleData } = useLoaderData<typeof loader>() as {
    scheduleData: ScheduleData;
  };

  return <WeekCalendar scheduleData={scheduleData} />;
}
