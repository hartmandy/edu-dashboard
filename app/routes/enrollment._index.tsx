import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { db } from "~/utils/db.server";
import { prepareCourseData } from "~/utils/calendar.server";

export const loader = async () => {
  const student = await db.student.findUnique({
    where: {
      id: 1,
    },
    include: {
      enrollments: {
        where: {
          status: "DRAFT",
        },
        include: {
          course: {
            include: {
              sections: {
                include: {
                  days: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student?.enrollments) {
    return { enrollments: null };
  }

  const enrollments = prepareCourseData(student?.enrollments || []);

  return { enrollments };
};

export default function Calendar() {
  const { enrollments } = useLoaderData<any>();
  console.log({ enrollments });
  return <WeekCalendar preparedData={enrollments} />;
}
