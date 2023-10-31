import { PersonIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
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
  const enrollFetcher = useFetcher();
  const days = section?.days?.map((d) => d.dayOfWeek).toString();
  return (
    <li
      key={section.id}
      className="border-b dark:border-zinc-700 border-zinc-400 p-4"
    >
      <h2 className="text-2xl mb-2">{section?.teacher?.username}</h2>
      <div className="flex justify-between items-center">
        <div>
          {section?.days?.map((day) => (
            <span
              key={day.id}
              className="dark:bg-blue-300 dark:text-black bg-blue-500 text-white py-1 px-3 rounded mr-2 font-semibold"
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
          <enrollFetcher.Form method="post">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="sectionId" value={section.id} />
            <input type="hidden" name="studentId" value={1} />
            <input type="hidden" name="startTime" value={section.startTime} />
            <input type="hidden" name="endTime" value={section.endTime} />
            <input type="hidden" name="daysOfWeek" value={days} />
            <button className="text-white dark:bg-blue-400 dark:text-black bg-blue-600 px-4 py-2 rounded font-semibold">
              Enroll
            </button>
          </enrollFetcher.Form>
        </div>
      </div>
    </li>
  );
}
