import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import CourseSearchForm from "~/components/CourseSearchForm";
import { searchCourses } from "~/data/course.server";
import CourseCard from "~/components/CourseCard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("search");
  const courses = await searchCourses(term);

  return { courses };
};

export default function Enrollment() {
  const { courses } = useLoaderData<typeof loader>();

  return (
    <div className="flex w-screen h-screen border-t border-zinc-800">
      <div className="w-1/3 border-r  border-zinc-800">
        <CourseSearchForm />
        <div className="h-[calc(100%-73px)] overflow-y-auto relative">
          {courses.map((course: any) => (
            <CourseCard course={course} />
          ))}
        </div>
      </div>
      <div className="w-2/3 bg-zinc-900 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
