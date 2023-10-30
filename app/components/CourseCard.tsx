import { Link } from "@remix-run/react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Course } from "~/types";

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  const { subject, id, courseTitle, courseCode } = course;
  return (
    <Link to={`/course/${id}`}>
      <div className="p-6 border-b border-zinc-700 hover:bg-indigo-300 hover:text-black">
        <p className="text-lg focus:text-lg font-bold mb-2">{courseTitle}</p>
        <div className="flex w-full justify-between">
          <p className="text-sm focus:text-sm font-light">
            {subject?.code} {courseCode} - {subject?.name}
          </p>
          <ArrowTopRightIcon height={20} width={20} className="text-zinc-900" />
        </div>
      </div>
    </Link>
  );
}
