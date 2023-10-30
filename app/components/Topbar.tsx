import { ComponentInstanceIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

const TopBar = () => {
  return (
    <div className="bg-zinc-900 text-white p-6 flex justify-between items-center border-b border-zinc-700">
      <div className="flex items-center gap-2">
        <ComponentInstanceIcon height={25} width={25} />
        <h1 className="text-xl">CourseQueue</h1>
      </div>
      <div className="flex gap-10">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/registration">Registration</Link>
      </div>
    </div>
  );
};

export default TopBar;
