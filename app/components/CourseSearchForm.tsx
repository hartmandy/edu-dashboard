import { Form, useSearchParams } from "@remix-run/react";

export default function CourseSearchForm() {
  const [params] = useSearchParams();

  return (
    <Form method="get">
      <input
        id="search"
        placeholder="Search through this semester's courses."
        name="search"
        className="w-full p-6 border-b  border-zinc-800 bg-zinc-900 focus:outline-none"
        type="text"
        defaultValue={params.get("search") || ""}
      />
    </Form>
  );
}
