import { Form, useSearchParams } from "@remix-run/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
export default function CourseSearchForm() {
  const [params] = useSearchParams();

  return (
    <Form
      method="get"
      className="w-2/3 border-r dark:border-zinc-700 border-zinc-400"
    >
      <div className="relative">
        <MagnifyingGlassIcon
          height={20}
          width={20}
          style={{
            position: "absolute",
            top: "50%",
            left: "15px",
            transform: "translateY(-50%)",
          }}
        />
        <input
          id="search"
          placeholder="Search courses."
          name="search"
          className="w-full p-6 dark:bg-zinc-900 bg-zinc-50 focus:outline-none pl-10"
          type="text"
          defaultValue={params.get("search") || ""}
        />
      </div>
    </Form>
  );
}
