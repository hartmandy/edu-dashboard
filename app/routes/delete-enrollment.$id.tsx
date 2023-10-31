import { ActionFunctionArgs } from "@remix-run/node";
import { deleteEnrollment } from "~/data/enrollment.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  const { id } = params;

  await deleteEnrollment(id);

  return 200;
};
