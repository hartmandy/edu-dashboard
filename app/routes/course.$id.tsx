import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import CourseSectionCards from "~/components/CourseSectionCards";
import { validateRegistration } from "~/data/enrollment.server";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "~/utils/message.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id || isNaN(Number(id))) {
    return json({ status: 500, course: null });
  }

  // Fetch course data
  const course = await db.course.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      subject: true,
      sections: {
        include: {
          teacher: true,
          days: true,
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("No course found!");
  }

  return { course };
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { message, isValid } = await validateRegistration(
    Number(data.courseId),
    Number(data.studentId),
    String(data.startTime),
    String(data.endTime),
    String(data.daysOfWeek)
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
  await db.enrollment.create({
    data: {
      courseId: Number(data.courseId),
      sectionId: Number(data.sectionId),
      studentId: Number(data.studentId),
    },
  });
  return redirect("/registration");
}

export default function CoursePage() {
  const { course } = useLoaderData<typeof loader>();

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
        {course?.sections.map((section) => (
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
