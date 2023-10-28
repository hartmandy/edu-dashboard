import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import CourseSearchForm from "~/components/CourseSearchForm";
import { db } from "~/utils/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("search");
  console.log(term);
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

  console.log({ courses });
  return (
    <div className="flex w-screen h-screen text-white border-t border-zinc-800">
      <div className="w-1/3 border-r  border-zinc-800">
        <CourseSearchForm />
        <div className="h-[calc(100%-73px)] overflow-y-scroll relative">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="p-6 border-b border-zinc-800 hover:bg-indigo-300 hover:text-black"
            >
              <p className="text-lg focus:text-lg font-bold mb-2">
                {course.courseTitle}
              </p>
              <div className="flex w-full justify-between">
                <p className="text-sm focus:text-sm font-light">
                  {course.subject.code} {course.courseCode} -{" "}
                  {course.subject.name}
                </p>
                <button>view more</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 bg-zinc-900">
        <Outlet />
      </div>
    </div>
  );
}
