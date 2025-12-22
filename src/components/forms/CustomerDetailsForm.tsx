import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { getCustomerById, deleteCustomer, CustomerData } from "../../services/customers";
import Toast from "../ui/toast/Toast";

export default function CustomerDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Load customer data on mount
  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getCustomerById(id!);
      
      if (response.success && response.data) {
        setCustomer(response.data.customer);
      } else {
        const errorResponse = response as { success: false; message: string };
        setError(errorResponse.message || "Failed to load customer");
      }
    } catch (err) {
      setError("An error occurred while loading customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/customers/edit/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    if (!id) {
      return;
    }

    try {
      const response = await deleteCustomer(id);

      if (response.success) {
        setToastMessage(response.message || "Customer deleted successfully!");
        setShowToast(true);
        
        // Navigate back after deletion
        setTimeout(() => {
          navigate("/customers");
        }, 2000);
      } else {
        const errorResponse = response as { success: false; message: string };
        setToastMessage(errorResponse.message || "Failed to delete customer");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      setToastMessage("An unexpected error occurred. Please try again.");
      setShowToast(true);
    }
  };

  const handleBack = () => {
    navigate("/customers");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Customer Details">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading customer details...</p>
        </div>
      </ComponentCard>
    );
  }

  if (error || !customer) {
    return (
      <ComponentCard title="Customer Details">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-500 dark:text-red-400">{error || "Customer not found"}</p>
          <Button variant="outline" onClick={handleBack}>
            Back to Customers
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
      <ComponentCard title="Customer Details">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Customer Information
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View customer details and information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={customer.name}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customer.email || ""}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={customer.phone || ""}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <div className="mt-2">
                <Badge 
                  size="sm" 
                  color={customer.status === 1 ? "success" : "warning"}
                >
                  {customer.status_label}
                </Badge>
              </div>
            </div>

            {/* Completed Bookings */}
            <div>
              <Label htmlFor="completed_bookings">Completed Bookings</Label>
              <Input
                id="completed_bookings"
                name="completed_bookings"
                type="number"
                value={customer.total_completed_bookings}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>

            {/* Loyalty Program */}
            <div>
              <Label htmlFor="loyalty_program">Loyalty Program</Label>
              {customer.loyalty_program ? (
                <div className="mt-2 space-y-2">
                  <Badge color="success" size="sm">
                    {customer.loyalty_program.name}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium">Description:</span> {customer.loyalty_program.description}</p>
                    <p><span className="font-medium">Reward Type:</span> {customer.loyalty_program.reward_type}</p>
                    <p><span className="font-medium">Reward Value:</span> {customer.loyalty_program.reward_value}</p>
                  </div>
                </div>
              ) : (
                <Input
                  id="loyalty_program"
                  name="loyalty_program"
                  type="text"
                  value="No loyalty program"
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleBack}
            >
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

