import {
  Course as PrismaCourse,
  Subject as PrismaSubject,
  Student as PrismaStudent,
  Enrollment as PrismaEnrollment,
  CourseSection as PrismaCourseSection,
  CourseSectionDay as PrismaCourseSectionDay,
  Teacher as PrismaTeacher,
} from "@prisma/client";

type Course = PrismaCourse & {
  subject?: Subject;
  sections?: CourseSection[];
};

type Subject = PrismaSubject;

type CourseSection = PrismaCourseSection & {
  teacher?: Teacher;
  days?: CourseSectionDay[];
  enrollments?: Enrollment[];
};

type CourseSectionDay = PrismaCourseSectionDay;
type Teacher = PrismaTeacher;
type Student = PrismaStudent & {
  enrollments?: Enrollment[];
  courses?: Course[];
};

type Enrollment = PrismaEnrollment & {
  course?: Course;
  student?: Student;
  section?: CourseSection;
};

type PreparedData = {
  [key: string]: TimeBlockData[];
};

type TimeBlockData = {
  startTime: string;
  endTime: string;
  courseTitle: string;
  id: number;
  status: "DRAFT" | "ENROLLED";
};

export type {
  Course,
  Subject,
  Student,
  Enrollment,
  CourseSection,
  CourseSectionDay,
  Teacher,
  TimeBlockData,
  PreparedData,
};
