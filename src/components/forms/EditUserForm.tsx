import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { User } from "../tables/Users/UserTable";

interface UserFormData {
  username: string;
  password: string;
  role: "admin" | "customer";
}

// Mock function to fetch user by ID
const fetchUserById = (id: string): User | null => {
  // In a real app, this would fetch from an API
  const usernames = ["admin", "admin1", "customer1", "customer2", "john_doe"];
  const roles: ("admin" | "customer")[] = ["admin", "customer"];
  
  // Generate a mock user based on ID
  const idx = parseInt(id) % usernames.length;
  return {
    _id: id,
    username: usernames[idx],
    password_hash: "$2a$10$hashedpasswordexample",
    role: roles[idx < 2 ? 0 : 1],
  };
};

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "customer", label: "Customer" },
];

export default function EditUserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    role: "customer",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (id) {
      const user = fetchUserById(id);
      if (user) {
        setFormData({
          username: user.username,
          password: "",
          role: user.role,
        });
      }
      setIsLoading(false);
    }
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (changePassword) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
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
      console.log("User updated:", {
        username: formData.username,
        password_hash: changePassword ? "hashed_password_here" : undefined, // Only update if password changed
        role: formData.role,
      });
      
      // Here you would typically make an API call to update the user
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

  if (isLoading) {
    return (
      <ComponentCard title="Edit User">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message="User updated successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Edit User">
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

          {/* Change Password Checkbox */}
          <div className="md:col-span-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Change Password
              </span>
            </label>
          </div>

          {/* Password - Only show if changePassword is checked */}
          {changePassword && (
            <div>
              <Label htmlFor="password">New Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={!!errors.password}
                hint={errors.password}
              />
            </div>
          )}
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
            {isSubmitting ? "Updating..." : "Update User"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

