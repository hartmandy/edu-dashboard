import { ComponentInstanceIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

const TopBar = () => {
  return (
    <div className="dark:bg-zinc-900 dark:text-white bg-zinc-100 text-black p-6 flex justify-between items-center border dark:border-zinc-700 border-zinc-400">
      <div className="flex items-center gap-2 font-bold">
        <ComponentInstanceIcon height={25} width={25} />
        <h1 className="text-xl">CourseQueue</h1>
      </div>
      <div className="flex gap-10 font-semibold">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/registration">Registration</Link>
      </div>
    </div>
  );
};

export default TopBar;
