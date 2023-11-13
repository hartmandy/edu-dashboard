import { cssBundleHref } from "@remix-run/css-bundle";
import { json, LoaderFunctionArgs, type LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import TopBar from "./components/Topbar";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Toaster, toast } from "react-hot-toast";
import type { ToastMessage } from "~/utils/message.server";
import { commitSession, getSession } from "~/utils/message.server";
import React from "react";
import { Chatbot } from "./routes/chatbot";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  const toastMessage = session.get("toastMessage") as ToastMessage;

  if (!toastMessage) {
    return json({ toastMessage: null });
  }

  if (!toastMessage.type) {
    throw new Error("Message should have a type");
  }

  return json(
    { toastMessage },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export default function App() {
  const { toastMessage } = useLoaderData<typeof loader>();

  React.useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  return (
    <html
      lang="en"
      className="dark:bg-zinc-900 dark:text-white bg-zinc-50 text-black"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen">
        <div className="lg:block hidden h-full">
          <TopBar />
          <Outlet />
          <Toaster />
          <Chatbot />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
        <div className="block lg:hidden text-center p-4">
          <h2 className="font-bold text-xl mb-2">Mobile View Not Optimized</h2>
          <p className="text-gray-700">
            We're sorry for the inconvenience, but our application is currently
            not optimized for mobile view. For the best user experience, please
            access our application from a desktop or a larger screen device. We
            appreciate your understanding.
          </p>
        </div>
      </body>
    </html>
  );
}
