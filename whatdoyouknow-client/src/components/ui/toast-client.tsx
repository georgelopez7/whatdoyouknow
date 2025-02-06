"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IToastClientProps {
  type: "success" | "error" | "warning";
  message: string | null;
}

const ToastClient = ({ type, message }: IToastClientProps) => {
  const router = useRouter();

  useEffect(() => {
    if (message) {
      const TIMEOUT_ID = setTimeout(() => {
        toast[type](message);

        // --- CLEAR ROUTER ---
        const url = new URL(window.location.href);
        url.search = "";
        router.replace(url.toString(), { scroll: false });
      }, 500);

      return () => clearTimeout(TIMEOUT_ID);
    }
  }, [type, message, router]);

  return null;
};

export default ToastClient;
