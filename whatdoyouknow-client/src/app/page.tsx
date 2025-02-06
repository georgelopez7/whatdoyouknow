import CreateRoomForm from "@/components/forms/create-room-form";
import PageLayout from "@/components/page-layout/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ToastClient from "@/components/ui/toast-client";
import { PersonStandingIcon } from "lucide-react";
import Link from "next/link";

interface IHomePageProps {
  searchParams: { [key: string]: string | undefined };
}

export default function Home({ searchParams }: IHomePageProps) {
  const errorMessage = searchParams?.message ?? null;

  return (
    <PageLayout>
      <Separator className="my-8 md:my-16" />
      <h1 className="text-6xl font-bold text-center">what do you know?</h1>
      <Separator className="my-2" />
      <p className="text-center text-lg text-muted-foreground">
        Challenge your friends with AI-generated quiz questions!
      </p>
      <Separator className="my-6" />
      <div className="w-[70vw] md:w-[40vw] lg:w-[20vw] mx-auto flex flex-col items-center justify-center">
        <CreateRoomForm />
        <Separator className="my-2" />
        <p className="text-center font-bold">OR</p>
        <Separator className="my-2" />
        <Link href="/rooms/join" className={buttonVariants()}>
          <PersonStandingIcon />
          Join Room
        </Link>
      </div>
      <Separator className="my-4" />
      <ToastClient type="error" message={errorMessage} />
    </PageLayout>
  );
}
