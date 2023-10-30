import { Form } from "@remix-run/react";

export default function RegisterButton() {
  return (
    <Form className="w-1/3" method="POST">
      <button className="hover:bg-indigo-400 w-full h-full">Register</button>
    </Form>
  );
}
