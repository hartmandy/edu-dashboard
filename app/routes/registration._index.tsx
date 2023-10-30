import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { prepareCourseData } from "~/utils/calendar.server";
import { getStudentWithDraftEnrollments } from "~/data/student.server";
import { PreparedData } from "~/types";
import { json } from "@remix-run/node";

export const loader = async () => {
  const student = await getStudentWithDraftEnrollments();

  if (!student?.enrollments) {
    return { enrollments: null };
  }

  const preparedData = prepareCourseData(student?.enrollments || []);
  if (!preparedData) {
    throw new Error("Failed to get prepared calendar data");
  }

  return json({ preparedData });
};

export default function Calendar() {
  const { preparedData } = useLoaderData<typeof loader>() as {
    preparedData: PreparedData;
  };

  return <WeekCalendar preparedData={preparedData} />;
}
