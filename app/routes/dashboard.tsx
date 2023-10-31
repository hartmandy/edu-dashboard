import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { getStudentSchedule } from "~/data/student.server";
import { ScheduleData } from "~/types";

export const loader = async () => {
  const scheduleData = await getStudentSchedule("ENROLLED");

  return json({ scheduleData });
};

export default function Dashboard() {
  const { scheduleData } = useLoaderData<{ scheduleData: ScheduleData }>();

  return (
    <div className="overflow-auto no-scrollbar w-screen h-[calc(100vh-76px)]">
      <WeekCalendar scheduleData={scheduleData} />
    </div>
  );
}
