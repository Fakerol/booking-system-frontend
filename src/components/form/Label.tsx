import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  // Convert children to string to check for asterisk and style it
  const renderLabel = () => {
    if (typeof children === "string") {
      const parts = children.split(/(\s+\*)/);
      return parts.map((part, index) => {
        if (part.trim() === "*") {
          return <span key={index} className="text-error-500">*</span>;
        }
        return <span key={index}>{part}</span>;
      });
    }
    return children;
  };

  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
          className,
        ),
      )}
    >
      {renderLabel()}
    </label>
  );
};

export default Label;
