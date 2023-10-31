import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { getStudentWithEnrollments } from "~/data/student.server";
import { ScheduleData } from "~/types";
import { prepareScheduleData } from "~/utils/calendar.server";

export const loader = async () => {
  const student = await getStudentWithEnrollments();

  if (!student?.enrollments) {
    return { enrollments: null };
  }

  const scheduleData = prepareScheduleData(student?.enrollments || []);
  if (!scheduleData) {
    throw new Error("Failed to get prepared calendar data");
  }

  return json({ scheduleData });
};

export default function Dashboard() {
  const { scheduleData } = useLoaderData<typeof loader>() as {
    scheduleData: ScheduleData;
  };

  return (
    <div className="overflow-auto no-scrollbar w-screen h-[calc(100vh-76px)]">
      <WeekCalendar scheduleData={scheduleData} />
    </div>
  );
}
