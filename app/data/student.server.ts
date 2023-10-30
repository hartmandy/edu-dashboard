import { Student } from "~/types";
import { db } from "~/utils/db.server";

export async function getStudent() {
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
