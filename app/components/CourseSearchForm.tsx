import { Form, useSearchParams } from "@remix-run/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
export default function CourseSearchForm() {
  const [params] = useSearchParams();

  return (
    <Form method="get">
      <div className="relative">
        <MagnifyingGlassIcon
          height={20}
          style={{
            position: "absolute",
            top: "50%",
            left: "15px",
            transform: "translateY(-50%)",
          }}
        />
        <input
          id="search"
          placeholder="Search through this semester's courses."
          name="search"
          className="w-full p-6 border-b border-zinc-800 bg-zinc-900 focus:outline-none pl-10"
          type="text"
          defaultValue={params.get("search") || ""}
        />
      </div>
    </Form>
  );
}
