import { useEffect } from "react";
import { CheckCircleIcon } from "../../../icons";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 3000,
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

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3 rounded-lg border border-success-500 bg-success-50 px-4 py-3 shadow-lg dark:border-success-500/30 dark:bg-success-500/15">
        <CheckCircleIcon className="h-5 w-5 text-success-500" />
        <p className="text-sm font-medium text-success-700 dark:text-success-400">
          {message}
        </p>
      </div>
    </div>
  );
}

