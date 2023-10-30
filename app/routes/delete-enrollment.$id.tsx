import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  const { id } = params;
  try {
    await db.enrollment.delete({
      where: {
        id: Number(id),
      },
    });
  } catch {
    return 500;
  }

  return 200;
};
