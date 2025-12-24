import { useState, FormEvent, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { createService, getServiceCategories } from "../../services/services";

interface ServiceFormData {
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

export default function ServiceForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    duration: 30,
    price: 0,
    description: "",
    category: "",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [priceInput, setPriceInput] = useState<string>("");
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getServiceCategories();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    };
    fetchCategories();
  }, []);

  // Sync categoryInput with formData.category
  useEffect(() => {
    if (formData.category && !categoryInput) {
      setCategoryInput(formData.category);
    }
  }, [formData.category]);

  // Filter categories based on input
  const filteredCategories = useMemo(() => {
    if (!categoryInput.trim()) return categories;
    const lowerInput = categoryInput.toLowerCase();
    return categories.filter((cat) =>
      cat.toLowerCase().includes(lowerInput)
    );
  }, [categories, categoryInput]);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node) &&
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target as Node)
      ) {
        setShowCategorySuggestions(false);
      }
    };

    if (showCategorySuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCategorySuggestions]);

  // Handle price input - allow flexible numeric input including decimals starting with .
  const handlePriceChange = (value: string) => {
    // Allow empty string, just decimal point, or any numeric format
    // Store the raw input value to allow typing ".23" etc.
    setPriceInput(value);
    
    // Only update formData if it's a valid number
    if (value === "" || value === ".") {
      handleInputChange("price", 0);
      return;
    }
    
    // Parse as float, only update if valid number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      handleInputChange("price", numValue);
    }
  };

  // Handle category input
  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    handleInputChange("category", value);
    setShowCategorySuggestions(true);
  };

  const handleCategorySelect = (category: string) => {
    setCategoryInput(category);
    handleInputChange("category", category);
    setShowCategorySuggestions(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};

    // Name is required (max 255 characters)
    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    } else if (formData.name.length > 255) {
      newErrors.name = "Service name must be less than 255 characters";
    }

    // Duration is required (1-1440 minutes)
    if (formData.duration < 1 || formData.duration > 1440) {
      newErrors.duration = "Duration must be between 1 and 1440 minutes";
    }

    // Price is required (>= 0)
    if (formData.price < 0) {
      newErrors.price = "Price must be greater than or equal to 0";
    }

    // Description is optional, but if provided, max 2000 characters
    if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload
      const payload: {
        name: string;
        duration: number;
        price: number;
        description?: string;
        category?: string;
      } = {
        name: formData.name.trim(),
        duration: formData.duration,
        price: formData.price,
      };

      // Add optional fields only if they have values
      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }
      if (formData.category) {
        payload.category = formData.category;
      }
      // is_active defaults to 1 if omitted (handled by API)

      const response = await createService(payload);

      if (response.success && response.data) {
        setToastMessage("Service created successfully!");
        setToastType("success");
        setShowToast(true);
        
        // Navigate after showing toast
        setTimeout(() => {
          navigate("/services");
        }, 2000);
      } else {
        // Handle API errors - response is ApiError type
        const errorResponse = response as { success: false; message: string; errors?: Record<string, string[]> };
        let errorMessage = errorResponse.message || "Failed to create service";
        
        // Check if there are field-specific errors
        if (errorResponse.errors) {
          const fieldErrors = Object.entries(errorResponse.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; ");
          errorMessage = fieldErrors || errorMessage;
        }

        setErrors({
          name: errorResponse.errors?.name?.[0] || undefined,
          duration: errorResponse.errors?.duration?.[0] || undefined,
          price: errorResponse.errors?.price?.[0] || undefined,
          description: errorResponse.errors?.description?.[0] || undefined,
          category: errorResponse.errors?.category?.[0] || undefined,
        });

        setToastMessage(errorMessage);
        setToastType("error");
        setShowToast(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastType("error");
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/services");
  };

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <ComponentCard title="Create New Service">
        <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Service Name */}
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter service name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              hint={errors.name}
              maxLength={255}
            />
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <div className="relative">
              <input
                id="duration"
                name="duration"
                type="text"
                inputMode="numeric"
                placeholder="Enter duration in minutes"
                value={formData.duration === 0 ? "" : formData.duration.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string or numeric values only
                  if (value === "" || /^\d+$/.test(value)) {
                    handleInputChange("duration", value === "" ? 0 : parseInt(value) || 0);
                  }
                }}
                className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
                  errors.duration
                    ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
                    : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                }`}
              />
              {errors.duration && (
                <p className="mt-1.5 text-xs text-error-500">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price (RM) *</Label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="text"
                inputMode="decimal"
                placeholder="Enter price"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
                  errors.price
                    ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
                    : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                }`}
              />
              {errors.price && (
                <p className="mt-1.5 text-xs text-error-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="relative">
            <Label htmlFor="category">Category</Label>
            <div className="relative">
              <input
                ref={categoryInputRef}
                id="category"
                name="category"
                type="text"
                placeholder="Type or select category (optional)"
                value={categoryInput}
                onChange={(e) => handleCategoryInputChange(e.target.value)}
                onFocus={() => setShowCategorySuggestions(true)}
                className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
                  errors.category
                    ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
                    : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                }`}
              />
              {errors.category && (
                <p className="mt-1.5 text-xs text-error-500">{errors.category}</p>
              )}
            </div>
            {showCategorySuggestions && filteredCategories.length > 0 && (
              <div
                ref={categoryDropdownRef}
                className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700 max-h-60 overflow-y-auto"
              >
                {filteredCategories.map((category) => (
                  <div
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-800 dark:text-white/90"
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter service description (optional, max 2000 characters)"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            maxLength={2000}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${
              errors.description
                ? "bg-transparent border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800"
                : "bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-error-500">{errors.description}</p>
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
            {isSubmitting ? "Creating..." : "Create Service"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}
