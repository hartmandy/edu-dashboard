import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return json({ status: 500, course: null });
  }

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
    return json({ status: 404, course: null });
  }

  return json({ status: 200, course });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log({ data });
  await db.enrollment.create({
    data: {
      courseId: Number(data.courseId),
      sectionId: Number(data.sectionId),
      studentId: Number(data.studentId),
    },
  });

  return redirect("/enrollment");
}

export default function CoursePage() {
  const { course } = useLoaderData<typeof loader>();
  console.log({ course });
  return (
    <div className="flex h-full">
      <div className="w-3/5 px-10">
        <div className="max-w-xl grid gap-6 mt-10">
          <h1 className="text-7xl">{course?.courseTitle}</h1>
          <p className="text-xl">{course?.description}</p>
        </div>
      </div>
      <ul className="w-2/5 border-l border-zinc-800">
        {course?.sections.map((section) => (
          <li key={section.id} className="border-b border-zinc-800 p-4">
            <h2 className="text-2xl mb-2">{section.teacher.username}</h2>
            <div className="flex justify-between items-center">
              <div>
                {section.days.map((day) => (
                  <span
                    key={day.id}
                    className="bg-indigo-300 text-black p-1 rounded mr-2 font-semibold"
                  >
                    {dayAbbreviations[day.dayOfWeek]}
                  </span>
                ))}
                <p className="text-lg mt-2">
                  {section.startTime} - {section.endTime}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center">
                  <p className="text-lg flex ">
                    {section.enrollments.length}/{section.capacity}
                  </p>
                  <i>
                    <PersonIcon height={16} width={16} />
                  </i>
                </div>
                <Form method="post">
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="sectionId" value={section.id} />
                  <input type="hidden" name="studentId" value={1} />
                  <button className="text-white bg-indigo-500 px-4 py-2 rounded">
                    Enroll
                  </button>
                </Form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const dayAbbreviations = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thurs",
  FRIDAY: "Fri",
};
