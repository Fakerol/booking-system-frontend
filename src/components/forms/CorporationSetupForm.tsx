import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { createCorporation } from "../../services/corporations";

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

export default function CorporationSetupForm() {
  const navigate = useNavigate();

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

  const validateForm = (): boolean => {
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

    if (!formData.address_line1.trim()) {
      newErrors.address_line1 = "Address line 1 is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP/Postal code is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setFieldErrors({});
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createCorporation({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address_line1: formData.address_line1.trim(),
        address_line2: formData.address_line2.trim() || undefined,
        city: formData.city.trim(),
        zip: formData.zip.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        logo: formData.logo.trim() || undefined,
      });

      if (response.success) {
        setShowToast(true);
        // Redirect to dashboard after successful setup
        setTimeout(() => {
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
      <ComponentCard title="Corporation Setup">
        <Form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              General Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Corporation Name */}
              <div>
                <Label htmlFor="name">
                  Corporation Name <span className="text-error-500">*</span>
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
              <div>
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
              <div>
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
              <div>
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
          </div>

          {/* Address Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <Label htmlFor="address_line1">
                  Address Line 1 <span className="text-error-500">*</span>
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
                  City <span className="text-error-500">*</span>
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
                  State <span className="text-error-500">*</span>
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
                  ZIP/Postal Code <span className="text-error-500">*</span>
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
                  Country <span className="text-error-500">*</span>
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
          </div>

          {/* General Error */}
          {generalError && (
            <div className="p-3 text-sm text-error-500 bg-error-50 dark:bg-error-900/20 rounded-lg">
              {generalError}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        </Form>
      </ComponentCard>
    </>
  );
}

