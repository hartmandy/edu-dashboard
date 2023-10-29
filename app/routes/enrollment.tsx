import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import CourseSearchForm from "~/components/CourseSearchForm";
import { db } from "~/utils/db.server";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("search");
  const courses = await db.course.findMany({
    where: {
      courseTitle: { contains: term || "" },
    },
    include: {
      sections: true,
      subject: true,
    },
  });

  return { courses };
};

export default function Enrollment() {
  const { courses } = useLoaderData<any>();

  return (
    <div className="flex w-screen h-screen border-t border-zinc-800">
      <div className="w-1/3 border-r  border-zinc-800">
        <CourseSearchForm />
        <div className="h-[calc(100%-73px)] overflow-y-auto relative">
          {courses.map((course: any) => (
            <Link to={`/course/${course.id}`} key={course.id}>
              <div className="p-6 border-b border-zinc-800 hover:bg-indigo-300 hover:text-black border-r">
                <p className="text-lg focus:text-lg font-bold mb-2">
                  {course.courseTitle}
                </p>
                <div className="flex w-full justify-between">
                  <p className="text-sm focus:text-sm font-light">
                    {course.subject.code} {course.courseCode} -{" "}
                    {course.subject.name}
                  </p>
                  <ArrowTopRightIcon
                    height={20}
                    width={20}
                    className="text-zinc-900"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-2/3 bg-zinc-900 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
