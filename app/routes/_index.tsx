import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Form } from "@remix-run/react";
import { db } from "~/utils/db.server";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "~/utils/message.server";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Edu Dashboard" },
    { name: "description", content: "Education Dashboard" },
  ];
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  try {
    await db.enrollment.deleteMany({
      where: {
        studentId: {
          equals: 1,
        },
      },
    });
    setSuccessMessage(session, "Successfully reset demo.");
    return json(
      { ok: true },
      {
        headers: { "Set-Cookie": await commitSession(session) },
      }
    );
  } catch (err) {
    setErrorMessage(session, "Failed to reset demo.");
    return json(
      { ok: false },
      {
        headers: { "Set-Cookie": await commitSession(session) },
      }
    );
  }
};

export default function Index() {
  return (
    <div className="h-[calc(100vh-76px)] grid place-content-center border-x border-b dark:border-zinc-700 border-zinc-400">
      <div className="flex gap-4">
        <Link
          to="/registration"
          className="dark:bg-blue-400 py-4 w-[250px] text-center dark:text-black bg-blue-600 text-white font-semibold"
        >
          Continue in as Amanda
        </Link>
        <Form
          method="POST"
          className="border-2 dark:border-blue-400 dark:text-blue-400 border-blue-600 text-blue-600 py-4 w-[250px] text-center font-semibold"
        >
          <button>Reset demo</button>
        </Form>
      </div>
    </div>
  );
}
