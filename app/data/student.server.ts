import { db } from "~/utils/db.server";
import { prepareScheduleData } from "~/utils/calendar.server";

export async function getStudentWithEnrollments(status?: "DRAFT" | "ENROLLED") {
  const student = await db.student.findUnique({
    where: {
      id: 1,
    },
    include: {
      enrollments: {
        where: {
          status: status || "DRAFT",
        },
        include: {
          section: {
            include: {
              days: true,
              course: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new Error("User not found");
  }

  return student;
}

export async function getStudentSchedule(status?: "DRAFT" | "ENROLLED") {
  const student = await getStudentWithEnrollments(status);
  if (!student?.enrollments) {
    return { enrollments: null };
  }

  const scheduleData = prepareScheduleData(student?.enrollments || []);
  if (!scheduleData) {
    throw new Error("Failed to get prepared calendar data");
  }
  return scheduleData;
}
