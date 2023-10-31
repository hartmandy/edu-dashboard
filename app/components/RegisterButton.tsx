import { Form } from "@remix-run/react";

export default function RegisterButton() {
  return (
    <Form className="w-1/3" method="POST">
      <button className="hover:dark:bg-blue-400 hover:bg-blue-600 w-full h-full hover:dark:text-black hover:text-white font-semibold">
        Register
      </button>
    </Form>
  );
}
