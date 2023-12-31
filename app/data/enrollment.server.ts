import { db } from "~/utils/db.server";

export const register = async () => {
  await db.enrollment.updateMany({
    where: {
      studentId: {
        equals: 1,
      },
    },
    data: {
      status: "ENROLLED",
    },
  });
};

export const validateRegistration = async (
  courseId: number,
  studentId: number,
  startTime: string,
  endTime: string,
  daysOfWeek: string
) => {
  const isAlreadyRegistered = await checkIfAlreadyRegistered(
    courseId,
    studentId
  );

  if (isAlreadyRegistered) {
    return {
      message: "You are already registered for this course.",
      isValid: !isAlreadyRegistered,
    };
  }

  const hasScheduleConflict = await checkIfThereIsAScheduleConflict(
    studentId,
    startTime,
    endTime,
    daysOfWeek
  );

  if (hasScheduleConflict) {
    return {
      message: `There is a schedule conflict between ${startTime} - ${endTime}.`,
      isValid: !hasScheduleConflict,
    };
  }

  return { message: "Valid enrollment.", isValid: true };
};

const checkIfAlreadyRegistered = async (
  courseId: number,
  studentId: number
) => {
  const exists = await db.enrollment.findFirst({
    where: {
      courseId: {
        equals: Number(courseId),
      },
      studentId: {
        equals: Number(studentId),
      },
    },
  });

  return Boolean(exists);
};

const checkIfThereIsAScheduleConflict = async (
  studentId: number,
  startTime: string,
  endTime: string,
  daysOfWeek: string
) => {
  const newCourseStartTimeMinutes = timeToMinutes(startTime);
  const newCourseEndTimeMinutes = timeToMinutes(endTime);
  const daysOfWeekArray = daysOfWeek.split(",");
  const enrollments = await db.enrollment.findMany({
    where: {
      studentId: Number(studentId),
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
  });

  const conflicts = enrollments.filter((enrollment) => {
    const { sections } = enrollment.course;
    return sections.some((section) => {
      const startTimeMinutes = timeToMinutes(section.startTime);
      const endTimeMinutes = timeToMinutes(section.endTime);
      const sectionDays = section.days.map((d) => d.dayOfWeek);

      const isTimeConflict =
        startTimeMinutes < newCourseEndTimeMinutes &&
        endTimeMinutes > newCourseStartTimeMinutes;

      const isDayConflict = sectionDays.some((day) =>
        daysOfWeekArray.includes(day)
      );

      const isConflict = isTimeConflict && isDayConflict;
      return isConflict;
    });
  });

  return conflicts.length > 0;
};

const timeToMinutes = (timeString: string) => {
  const match = timeString.match(/(\d+):(\d+)(AM|PM)/);
  if (match) {
    const [_, hours, minutes, period] = match;
    let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

    if (period === "PM" && parseInt(hours, 10) !== 12) {
      totalMinutes += 12 * 60;
    }
    if (period === "AM" && parseInt(hours, 10) === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  } else {
    throw new Error("Invalid time format");
  }
};

export async function deleteEnrollment(id?: string) {
  if (!id) {
    throw new Error("No id provided.");
  }
  try {
    await db.enrollment.delete({
      where: {
        id: Number(id),
      },
    });
  } catch {
    return 500;
  }
}

export async function deleteAllEnrollment() {
  await db.enrollment.deleteMany({
    where: {
      studentId: {
        equals: 1,
      },
    },
  });
}

export async function createEnrollment(
  courseId: number,
  sectionId: number,
  studentId: number
) {
  await db.enrollment.create({
    data: {
      courseId,
      sectionId,
      studentId,
    },
  });
}

// Get all courses on the platform, their sections, teacher, and days.
export const getAllCourses = async () => {
  const courses = await db.course.findMany({
    include: {
      subject: true,
      sections: {
        include: {
          teacher: true,
          days: {},
        },
      },
    },
  });

  return formatCoursesForGPT(courses);
};

function formatCoursesForGPT(courses: any[]) {
  return courses
    .map((course) => {
      const sectionsInfo = course.sections
        .map((section: any) => {
          const days = section.days.map((day: any) => day.dayOfWeek).join(", ");
          return `Section taught by ${section.teacher.username} on ${days} from ${section.startTime} to ${section.endTime}`;
        })
        .join("; ");

      return `Course Title: ${course.courseTitle} (Code: ${course.courseCode}, Subject: ${course.subject.name})
Description: ${course.description}
Sections: ${sectionsInfo}`;
    })
    .join("\n\n");
}
