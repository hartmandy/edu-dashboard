import { Form, useSearchParams } from "@remix-run/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
export default function CourseSearchForm() {
  const [params] = useSearchParams();

  return (
    <Form method="get" className="w-2/3 border-r border-zinc-800">
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
          className="w-full p-6 bg-zinc-900 focus:outline-none pl-10"
          type="text"
          defaultValue={params.get("search") || ""}
        />
      </div>
    </Form>
  );
}
