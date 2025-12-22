import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { User } from "../tables/Users/UserTable";
import Toast from "../ui/toast/Toast";

import { userData } from "../tables/Users/UserTable";

// Mock function to fetch user by ID
const fetchUserById = (id: string): User | null => {
  return userData.find((u: User) => u._id === id) || null;
};

export default function UserDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (id) {
      const foundUser = fetchUserById(id);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError("User not found");
      }
      setIsLoading(false);
    }
  }, [id]);

  const getRoleColor = (role: string) => {
    return role === "admin" ? "error" : "success";
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/users/edit/${id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setToastMessage("User deleted successfully!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/users");
      }, 2000);
    }
  };

  const handleBack = () => {
    navigate("/users");
  };

  if (isLoading) {
    return (
      <ComponentCard title="User Details">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading user details...</p>
        </div>
      </ComponentCard>
    );
  }

  if (error || !user) {
    return (
      <ComponentCard title="User Details">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-500 dark:text-red-400">{error || "User not found"}</p>
          <Button variant="outline" onClick={handleBack}>
            Back to Users
          </Button>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="User Details">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              User Information
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View user details and information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={user.username}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <div className="mt-2">
                <Badge size="sm" color={getRoleColor(user.role) as any}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="password_hash">Password Hash</Label>
              <Input
                id="password_hash"
                name="password_hash"
                type="text"
                value={user.password_hash}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              startIcon={<TrashBinIcon className="h-4 w-4" />}
              onClick={handleDelete}
              className="bg-error-500 hover:bg-error-600 text-white !px-4 !py-3"
            >
              Delete
            </Button>
            <Button
              variant="primary"
              size="sm"
              startIcon={<PencilIcon className="h-4 w-4" />}
              onClick={handleEdit}
              className="!px-4 !py-3"
            >
              Edit
            </Button>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}

