"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const RedirectUser = (redirect_url: string) => {
  revalidatePath("/", "layout");
  redirect(redirect_url);
};
