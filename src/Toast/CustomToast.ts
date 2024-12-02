import { useCallback } from "react";
import { toaster } from "../components/ui/toaster";

export const CustomToast = () => {
  const showToast = useCallback(
    (title: string, description: string, type: "success" | "error" | "info" | "warning" | "loading") => {
      toaster.create({
        title,
        description,
        type,
      });
    },
    []
  );

  return showToast;
};
