import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { ScheduleData } from "~/types";
import { json } from "@remix-run/node";
import { getStudenSchedule } from "~/data/student.server";

export const loader = async () => {
  const scheduleData = await getStudenSchedule();

  return json({ scheduleData });
};

export default function Calendar() {
  const { scheduleData } = useLoaderData<{ scheduleData: ScheduleData }>();

  return <WeekCalendar scheduleData={scheduleData} />;
}
