import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { getStudentWithEnrollments } from "~/data/student.server";
import { PreparedData } from "~/types";
import { prepareCourseData } from "~/utils/calendar.server";

export const loader = async () => {
  const student = await getStudentWithEnrollments();

  if (!student?.enrollments) {
    return { enrollments: null };
  }

  const preparedData = prepareCourseData(student?.enrollments || []);
  if (!preparedData) {
    throw new Error("Failed to get prepared calendar data");
  }

  return json({ preparedData });
};

export default function Dashboard() {
  const { preparedData } = useLoaderData<typeof loader>() as {
    preparedData: PreparedData;
  };

  return (
    <div className="overflow-auto no-scrollbar w-screen h-[calc(100vh-76px)]">
      <WeekCalendar preparedData={preparedData} />
    </div>
  );
}
