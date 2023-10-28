import { useLoaderData } from "@remix-run/react";
import WeekCalendar from "~/components/WeekCalendar";
import { db } from "~/utils/db.server";

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

  return { student };
};

export default function Calendar() {
  const { student } = useLoaderData<any>();
  console.log({ student });
  return (
    <div>
      <WeekCalendar enrollments={student.enrollments} />
    </div>
  );
}
