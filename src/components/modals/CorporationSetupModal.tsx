import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { Modal } from "../ui/modal";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { createCorporation } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

type TabType = "general" | "address";

interface CorporationFormData {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  logo: string;
}

export default function CorporationSetupModal() {
  const navigate = useNavigate();
  const { needsCorporationSetup, setCorporationSetupComplete } = useAuth();

  const [formData, setFormData] = useState<CorporationFormData>({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    zip: "",
    state: "",
    country: "",
    logo: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [generalInfoCompleted, setGeneralInfoCompleted] = useState(false);

  const validateRequiredFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Corporation name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    // For final submission, we still need to validate required fields
    return validateRequiredFields();
  };

  const handleNext = () => {
    setFieldErrors({});
    setGeneralError("");

    if (validateRequiredFields()) {
      setGeneralInfoCompleted(true);
      setActiveTab("address");
    }
  };

  const handleInputChange = (field: keyof CorporationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    setGeneralError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Only allow submission from address tab
    if (activeTab !== "address") {
      return;
    }

    setFieldErrors({});
    setGeneralError("");

    if (!validateForm()) {
      // If validation fails, go back to general tab to show errors
      setActiveTab("general");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createCorporation({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address_line1: formData.address_line1.trim() || undefined,
        address_line2: formData.address_line2.trim() || undefined,
        city: formData.city.trim() || undefined,
        zip: formData.zip.trim() || undefined,
        state: formData.state.trim() || undefined,
        country: formData.country.trim() || undefined,
        logo: formData.logo.trim() || undefined,
      });

      if (response.success) {
        setShowToast(true);
        setCorporationSetupComplete();
        // Navigate to dashboard after success
        setTimeout(() => {
          setShowToast(false);
          navigate("/dashboard");
        }, 2000);
      } else {
        // Map server validation errors to fieldErrors
        if (response.errors && typeof response.errors === "object") {
          const mapped: Record<string, string> = {};
          Object.keys(response.errors).forEach((k) => {
            if (Array.isArray(response.errors![k]) && response.errors![k].length > 0) {
              mapped[k] = response.errors![k][0];
            }
          });
          setFieldErrors(mapped);
        } else if (response.message) {
          setGeneralError(response.message);
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      }
    } catch (err) {
      setGeneralError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Toast
        message="Corporation setup completed successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <Modal
        isOpen={needsCorporationSetup}
        onClose={() => {}} // Prevent closing
        className="w-[90%] max-w-[800px] h-[90vh] max-h-[700px] m-4"
        showCloseButton={false} // Hide close button
        preventOutsideClick={true} // Prevent clicking outside to close
        preventEscape={true} // Prevent ESC key to close
      >
        <div className="relative w-full h-full flex flex-col p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-8">
          <div className="mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Barbershop Registration
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please complete your barbershop setup to continue using the system.
            </p>
          </div>

          <Form 
            onSubmit={handleSubmit} 
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-2 font-medium w-full rounded-md text-sm transition-colors ${
                    activeTab === "general"
                      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  General Information
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (generalInfoCompleted) {
                      setActiveTab("address");
                    }
                  }}
                  disabled={!generalInfoCompleted}
                  className={`px-4 py-2 font-medium w-full rounded-md text-sm transition-colors ${
                    activeTab === "address"
                      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      : !generalInfoCompleted
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Address Information
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
              {/* General Information Tab */}
              {activeTab === "general" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Corporation Name */}
                  <div className="col-span-2">
                    <Label htmlFor="name">
                      Barbershop Name <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter corporation name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={!!fieldErrors.name}
                      hint={fieldErrors.name}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-span-2">
                    <Label htmlFor="email">
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={!!fieldErrors.email}
                      hint={fieldErrors.email}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-span-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+60123456789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      error={!!fieldErrors.phone}
                      hint={fieldErrors.phone}
                    />
                  </div>

                  {/* Logo URL */}
                  <div className="col-span-2">
                    <Label htmlFor="logo">Logo URL (Optional)</Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={formData.logo}
                      onChange={(e) => handleInputChange("logo", e.target.value)}
                      error={!!fieldErrors.logo}
                      hint={fieldErrors.logo}
                    />
                  </div>
                </div>
              )}

              {/* Address Information Tab */}
              {activeTab === "address" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Address Line 1 */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address_line1">
                      Address Line 1 (Optional)
                    </Label>
                    <Input
                      id="address_line1"
                      name="address_line1"
                      type="text"
                      placeholder="No 12, Jalan Bukit Indah"
                      value={formData.address_line1}
                      onChange={(e) => handleInputChange("address_line1", e.target.value)}
                      error={!!fieldErrors.address_line1}
                      hint={fieldErrors.address_line1}
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address_line2"
                      name="address_line2"
                      type="text"
                      placeholder="Taman Bukit Indah"
                      value={formData.address_line2}
                      onChange={(e) => handleInputChange("address_line2", e.target.value)}
                      error={!!fieldErrors.address_line2}
                      hint={fieldErrors.address_line2}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city">
                      City (Optional)
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Seremban"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      error={!!fieldErrors.city}
                      hint={fieldErrors.city}
                    />
                  </div>

                  {/* State */}
                  <div>
                    <Label htmlFor="state">
                      State (Optional)
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Negeri Sembilan"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      error={!!fieldErrors.state}
                      hint={fieldErrors.state}
                    />
                  </div>

                  {/* ZIP/Postal Code */}
                  <div>
                    <Label htmlFor="zip">
                      ZIP/Postal Code (Optional)
                    </Label>
                    <Input
                      id="zip"
                      name="zip"
                      type="text"
                      placeholder="70400"
                      value={formData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      error={!!fieldErrors.zip}
                      hint={fieldErrors.zip}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <Label htmlFor="country">
                      Country (Optional)
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="Malaysia"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      error={!!fieldErrors.country}
                      hint={fieldErrors.country}
                    />
                  </div>
                </div>
              )}

              {/* General Error */}
              {generalError && (
                <div className="p-3 mt-4 text-sm text-error-500 bg-error-50 dark:bg-error-900/20 rounded-lg">
                  {generalError}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 px-2 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
              {activeTab === "general" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="min-w-[120px]"
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setActiveTab("general")}
                    variant="outline"
                    className="min-w-[120px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? "Setting up..." : "Submit"}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

