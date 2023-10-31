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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-zinc-900 dark:text-white bg-zinc-50 text-black h-screen">
        <TopBar />
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
