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
      <div className="p-6 border-b border-r dark:border-zinc-700 border-zinc-400 hover:dark:bg-blue-300 hover:bg-blue-500 hover:dark:text-black hover:text-white">
        <p className="text-lg focus:text-lg font-bold mb-2">{courseTitle}</p>
        <div className="flex w-full justify-between">
          <p className="text-sm focus:text-sm font-light">
            {subject?.code} {courseCode} - {subject?.name}
          </p>
          <ArrowTopRightIcon
            height={30}
            width={30}
            className="dark:text-zinc-900 text-zinc-50"
          />
        </div>
      </div>
    </Link>
  );
}
