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
import { CSSProperties } from "react";
import { Chatbot } from "./chatbot";

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
    <div className="flex h-[calc(100vh-76px)] overflow-hidden">
      <div className="w-1/3 border-l dark:border-zinc-700 border-zinc-400">
        <div className="flex border-b dark:border-zinc-700 border-zinc-400">
          <CourseSearchForm />
          <RegisterButton />
        </div>
        <div
          className="h-[calc(100%-73px)] overflow-y-auto relative pb-10"
          style={
            {
              "scrollbarGutter?": "stable",
            } as CSSProperties
          }
        >
          {courses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      <div className="w-2/3 overflow-y-auto no-scrollbar">
        <Outlet />
      </div>
      <Chatbot />
    </div>
  );
}
