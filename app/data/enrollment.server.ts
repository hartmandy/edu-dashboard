import { db } from "~/utils/db.server";

export const createEnrollment = async ({
  courseId,
  sectionId,
  studentId,
}: {
  courseId: string;
  sectionId: string;
  studentId: string;
}) => {
  try {
    await db.enrollment.create({
      data: {
        courseId: Number(courseId),
        sectionId: Number(sectionId),
        studentId: Number(studentId),
      },
    });
  } catch (err) {
    throw new Error("Failed to create enrollment");
  }
};

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
