import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

export async function searchCourses(term: string | null) {
  const courses = await db.course.findMany({
    where: {
      courseTitle: { contains: term || "" },
    },
    include: {
      sections: true,
      subject: true,
    },
  });

  return courses;
}

export const getCourseById = async (id: string | undefined) => {
  if (!id || isNaN(Number(id))) {
    return json({ status: 500, course: null });
  }

  const course = await db.course.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      subject: true,
      sections: {
        include: {
          teacher: true,
          days: true,
          enrollments: true,
        },
      },
    },
  });
  return course;
};
