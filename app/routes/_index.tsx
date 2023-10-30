import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Edu Dashboard" },
    { name: "description", content: "Education Dashboard" },
  ];
};

export default function Index() {
  return (
    <div className="h-[calc(100vh-76px)] grid place-content-center">
      <Link to="/registration" className="bg-indigo-400 px-6 py-4">
        Continue in as Amanda
      </Link>
    </div>
  );
}
