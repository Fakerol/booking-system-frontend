import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import Form from "../components/form/Form";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import Toast from "../components/ui/toast/Toast";
import { useModal } from "../hooks/useModal";

export default function UserProfiles() {
  const { user } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    role: user?.role || "customer",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleOpenEdit = () => {
    if (user) {
      setFormData({
        username: user.username,
        password: "",
        role: user.role,
      });
      setChangePassword(false);
      setErrors({});
      openModal();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
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
        password_hash: changePassword ? "hashed_password_here" : undefined,
        role: formData.role,
      });

      // Update user in localStorage (in a real app, this would be an API call)
      if (user) {
        const updatedUser = {
          ...user,
          username: formData.username,
          role: formData.role,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Reload the page to reflect changes (in a real app, update context)
        window.location.reload();
      }

      setIsSubmitting(false);
      setShowToast(true);
      closeModal();

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Customer" },
  ];

  return (
    <>
      <PageMeta
        title="User Profile | JustBook - React Admin Dashboard Template"
        description="User profile page for viewing and editing user information"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <Toast
        message="Profile updated successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Profile</h3>
          <Button size="sm" onClick={handleOpenEdit} startIcon={
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
          }>
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          {/* User Meta Card */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                  <img src="/images/user/owner.jpg" alt="user" />
                </div>
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                    {user.username}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.role === "admin" ? "Administrator" : "Customer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  User Information
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Username
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {user.username}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Role
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {user.role === "admin" ? "Administrator" : "Customer"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      User ID
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {user._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit User Profile
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your user information.
            </p>
          </div>
          <Form onSubmit={handleSubmit} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="edit-username">Username *</Label>
                  <Input
                    id="edit-username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    error={!!errors.username}
                  />
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.username}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select
                    options={[
                      { value: "", label: "Select Role" },
                      ...roleOptions,
                    ]}
                    placeholder="Select Role"
                    onChange={(value) => handleInputChange("role", value)}
                    defaultValue={formData.role}
                  />
                </div>

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

                {changePassword && (
                  <div>
                    <Label htmlFor="edit-password">New Password *</Label>
                    <Input
                      id="edit-password"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      error={!!errors.password}
                    />
                    {errors.password && (
                      <p className="mt-1.5 text-xs text-error-500">{errors.password}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                Close
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}