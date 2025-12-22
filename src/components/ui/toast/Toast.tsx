import { useEffect } from "react";
import { CheckCircleIcon, ErrorIcon } from "../../../icons";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: "success" | "error";
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 3000,
  type = "success",
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const isError = type === "error";

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] animate-in fade-in slide-in-from-top-2">
      <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${
        isError
          ? "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15"
          : "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15"
      }`}>
        {isError ? (
          <ErrorIcon className="h-5 w-5 text-error-500" />
        ) : (
          <CheckCircleIcon className="h-5 w-5 text-success-500" />
        )}
        <p className={`text-sm font-medium ${
          isError
            ? "text-error-700 dark:text-error-400"
            : "text-success-700 dark:text-success-400"
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
}

