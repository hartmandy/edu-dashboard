import { db } from "~/utils/db.server";

export async function getStudentWithDraftEnrollments() {
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

  if (!student) {
    throw new Error("User not found");
  }

  return student;
}
