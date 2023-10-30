import type { MetaFunction } from "@remix-run/node";
import { db } from "../utils/db.server";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Edu Dashboard" },
    { name: "description", content: "Education Dashboard" },
  ];
};

export default function Index() {
  // const { courseSections } = useLoaderData<any>();
  // return (
  //   <h1 className="m-10">
  //     {courseSections.map((courseSection: any) => (
  //       <p>{courseSection.id}</p>
  //     ))}
  //   </h1>
  // );

  return "landing";
}
