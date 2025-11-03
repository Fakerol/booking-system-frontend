import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";

interface UserFormData {
  username: string;
  password: string;
  role: "admin" | "customer";
}

export default function UserForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    role: "customer",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Customer" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("User created:", {
        username: formData.username,
        password_hash: "hashed_password_here", // In real app, hash the password
        role: formData.role,
      });
      
      // Here you would typically make an API call to create the user
      // The password would be hashed on the backend
      setIsSubmitting(false);
      setShowToast(true);
      
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/users");
      }, 3100);
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <>
      <Toast
        message="User created successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Create New User">
        <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Username */}
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              error={!!errors.username}
              hint={errors.username}
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select
              options={[
                { value: "", label: "Select Role" },
                ...roleOptions,
              ]}
              placeholder="Select Role"
              onChange={(value) => handleInputChange("role", value as "admin" | "customer")}
              defaultValue={formData.role}
            />
            {errors.role && (
              <p className="mt-1.5 text-xs text-error-500">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={!!errors.password}
              hint={errors.password}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

