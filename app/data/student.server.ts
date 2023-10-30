import { db } from "~/utils/db.server";

export async function getStudentWithDraftEnrollments() {
  // TODO: get enrollments not student.
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

export async function getStudentWithEnrollments() {
  const student = await db.student.findUnique({
    where: {
      id: 1,
    },
    include: {
      enrollments: {
        where: {
          status: "ENROLLED",
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
