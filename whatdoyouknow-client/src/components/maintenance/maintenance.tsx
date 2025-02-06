import React from "react";
import { Separator } from "../ui/separator";

const Maintenance = () => {
  return (
    <div className="w-[90vw] mx-auto py-8">
      <Separator className="my-16" />
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-center">
          Under Maintenance
        </h1>
        <Separator className="my-2" />
        <p className="text-center text-muted-foreground">
          We&apos;re currently fine-tuning the system. Please check back
          shortly!
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
