import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import CourseSectionCards from "~/components/CourseSectionCards";
import {
  validateRegistration,
  createEnrollment,
} from "~/data/enrollment.server";
import {
  commitSession,
  getSession,
  setErrorMessage,
} from "~/utils/message.server";
import { getCourseById } from "~/data/course.server";
import { Course } from "~/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const course = await getCourseById(id);

  return { course };
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const courseId = Number(data.courseId);
  const studentId = Number(data.studentId);
  const startTime = String(data.startTime);
  const endTime = String(data.endTime);
  const daysOfWeek = String(data.daysOfWeek);
  const sectionId = Number(data.sectionId);

  const { message, isValid } = await validateRegistration(
    courseId,
    studentId,
    startTime,
    endTime,
    daysOfWeek
  );

  if (!isValid) {
    setErrorMessage(session, message);
    return json(
      { ok: false },
      {
        headers: { "Set-Cookie": await commitSession(session) },
      }
    );
  }

  await createEnrollment(courseId, sectionId, studentId);
  return redirect("/registration");
}

export default function CoursePage() {
  const { course } = useLoaderData<{ course: Course }>();

  return (
    <div className="flex h-full">
      <div className="w-3/5 px-10">
        <div className="max-w-xl grid gap-6 mt-10">
          <Link to={"/registration"}>Back</Link>
          <h1 className="text-7xl">{course?.courseTitle}</h1>
          <p className="text-xl">{course?.description}</p>
        </div>
      </div>
      <ul className="w-2/5 border-l dark:border-zinc-700 border-zinc-400">
        {course?.sections?.map((section) => (
          <CourseSectionCards
            key={section.id}
            course={course}
            section={section}
          />
        ))}
      </ul>
    </div>
  );
}
