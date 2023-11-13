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

// Get student enrollments and their section, course, and day for student number 1.
export async function getStudentEnrollments() {
  const enrollments = await db.enrollment.findMany({
    where: {
      studentId: 1,
      status: "DRAFT",
    },
    include: {
      section: {
        include: {
          course: true,
          days: true,
        },
      },
    },
  });

  return formatCourseDataForGPT(enrollments);
}

function formatCourseDataForGPT(data: any[]) {
  return data
    .map((datum: any) => {
      const { course, days, startTime, endTime } = datum.section;
      const daysOfWeek = days.map((day: any) => day.dayOfWeek).join(", ");

      return `Course Title: ${course.courseTitle}
Description: ${course.description}
Course Code: ${course.courseCode}
Scheduled Days: ${daysOfWeek}
Time: ${startTime} - ${endTime}`;
    })
    .join("\n\n");
}
