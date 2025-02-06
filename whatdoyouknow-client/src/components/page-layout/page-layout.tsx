import React from "react";
import { Separator } from "../ui/separator";
import Navbar from "@/components/page-layout/navbar/navbar";
import { cn } from "@/lib/utils";

interface IPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout = ({ children, className }: IPageLayoutProps) => {
  return (
    <div
      className={cn(
        "w-[90vw] lg:w-[60vw] flex flex-col items-center mx-auto",
        className
      )}
    >
      <Separator className="my-6" />
      <Navbar />
      {children}
      <Separator className="my-4" />
    </div>
  );
};

export default PageLayout;
