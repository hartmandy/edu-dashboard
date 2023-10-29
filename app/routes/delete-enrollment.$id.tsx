import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  const { id } = params;
  await db.enrollment.delete({
    where: {
      id: Number(id),
    },
  });

  return 200;
};
