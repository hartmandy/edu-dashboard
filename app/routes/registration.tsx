import { Outlet, useLoaderData } from "@remix-run/react";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import CourseSearchForm from "~/components/CourseSearchForm";
import { searchCourses } from "~/data/course.server";
import CourseCard from "~/components/CourseCard";
import RegisterButton from "~/components/RegisterButton";
import { register } from "~/data/enrollment.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("search");
  const courses = await searchCourses(term);

  return { courses };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    await register();
  } catch (err) {
    throw new Error("Failed to register.");
  }
  return redirect("/dashboard");
};

export default function Registration() {
  const { courses } = useLoaderData<typeof loader>();

  return (
    <div className="flex w-screen h-[calc(100vh-76px)] overflow-hidden">
      <div className="w-1/3 border-r  border-zinc-800">
        <div className="flex border-b border-zinc-800">
          <CourseSearchForm />
          <RegisterButton />
        </div>
        <div className="h-[calc(100%-73px)] overflow-y-auto relative">
          {courses.map((course: any) => (
            <CourseCard course={course} />
          ))}
        </div>
      </div>
      <div className="w-2/3 bg-zinc-900 overflow-y-auto no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
}
