import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface INavbarProps {
  className?: string;
}

const Navbar = ({ className }: INavbarProps) => {
  return (
    <div className={cn("w-full", className)}>
      <Link href="/" className="text-xl font-bold">
        whatdoyouknow
      </Link>
    </div>
  );
};

export default Navbar;
