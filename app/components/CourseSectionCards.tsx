import { PersonIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import { Course, CourseSection } from "~/types";

type Props = {
  section: CourseSection;
  course: Course;
};

const dayAbbreviations = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thurs",
  FRIDAY: "Fri",
};

export default function CourseSectionCards({ section, course }: Props) {
  return (
    <li key={section.id} className="border-b border-zinc-800 p-4">
      <h2 className="text-2xl mb-2">{section?.teacher?.username}</h2>
      <div className="flex justify-between items-center">
        <div>
          {section?.days?.map((day) => (
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
              {section?.enrollments?.length}/{section.capacity}
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
  );
}
