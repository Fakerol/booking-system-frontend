import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { Service } from "../tables/Services/ServiceTable";

interface ServiceFormData {
  name: string;
  duration_minutes: number;
  price: number;
  description: string;
}

// Mock function to fetch service by ID
const fetchServiceById = (id: string): Service | null => {
  // In a real app, this would fetch from an API
  // For now, we'll simulate fetching from the generated data
  const serviceNames = [
    "Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo",
    "Hair Extension", "Hair Treatment", "Hair Wash", "Hair Cut & Style",
    "Hair Coloring", "Full Haircut", "Hair Spa", "Hair Straightening",
  ];
  
  const descriptions = [
    "Professional haircut service with modern styling techniques.",
    "Expert hair coloring service with premium color products.",
    "Professional hair styling for any occasion.",
    "Precise beard trimming and shaping service.",
    "Deep cleansing shampoo treatment for healthy hair.",
    "Natural hair extension service with quality materials.",
    "Intensive hair treatment for damaged hair.",
    "Refreshing hair wash and conditioning service.",
    "Complete haircut and styling package.",
    "Professional hair coloring with consultation.",
    "Full service haircut with styling.",
    "Relaxing hair spa treatment.",
    "Hair straightening service for smooth results.",
  ];
  
  // Generate a mock service based on ID
  const idx = parseInt(id) % serviceNames.length;
  return {
    _id: id,
    name: serviceNames[idx],
    duration_minutes: [15, 30, 45, 60][idx % 4],
    price: [15, 25, 35, 50][idx % 4],
    description: descriptions[idx % descriptions.length] || "",
  };
};

export default function EditServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    duration_minutes: 30,
    price: 0,
    description: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Load service data on mount
  useEffect(() => {
    if (id) {
      const service = fetchServiceById(id);
      if (service) {
        setFormData({
          name: service.name,
          duration_minutes: service.duration_minutes,
          price: service.price,
          description: service.description || "",
        });
      }
      setIsLoading(false);
    }
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (formData.duration_minutes <= 0) {
      newErrors.duration_minutes = "Duration must be greater than 0";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string | number) => {
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
      console.log("Service updated:", formData);
      
      // Here you would typically make an API call to update the service
      setIsSubmitting(false);
      setShowToast(true);
      
      // Navigate after showing toast
      setTimeout(() => {
        navigate("/services");
      }, 3100);
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/services");
  };

  if (isLoading) {
    return (
      <ComponentCard title="Edit Service">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <Toast
        message="Service updated successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <ComponentCard title="Edit Service">
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
            />
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
            <Input
              id="duration_minutes"
              name="duration_minutes"
              type="number"
              placeholder="Enter duration in minutes"
              value={formData.duration_minutes}
              onChange={(e) => handleInputChange("duration_minutes", parseInt(e.target.value) || 0)}
              error={!!errors.duration_minutes}
              hint={errors.duration_minutes}
              min="1"
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price (RM) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
              error={!!errors.price}
              hint={errors.price}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            placeholder="Enter service description (optional)"
            rows={4}
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
            error={!!errors.description}
            hint={errors.description}
          />
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
            {isSubmitting ? "Updating..." : "Update Service"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

