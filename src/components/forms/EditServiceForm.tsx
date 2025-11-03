import { useState, FormEvent, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Toast from "../ui/toast/Toast";
import { Service } from "../tables/Services/ServiceTable";
import { PlusIcon, TrashBinIcon } from "../../icons";

interface ServiceFormData {
  name: string;
  duration_minutes: number;
  price: number;
  images: File[];
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
  
  // Generate a mock service based on ID
  const idx = parseInt(id) % serviceNames.length;
  return {
    _id: id,
    name: serviceNames[idx],
    duration_minutes: [15, 30, 45, 60][idx % 4],
    price: [15, 25, 35, 50][idx % 4],
    images: [
      `https://picsum.photos/200/200?random=${id}-1`,
      `https://picsum.photos/200/200?random=${id}-2`,
    ],
  };
};

export default function EditServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    duration_minutes: 30,
    price: 0,
    images: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Load service data on mount
  useEffect(() => {
    if (id) {
      const service = fetchServiceById(id);
      if (service) {
        setFormData({
          name: service.name,
          duration_minutes: service.duration_minutes,
          price: service.price,
          images: [],
        });
        setExistingImages(service.images);
        setImagePreviews(service.images);
      }
      setIsLoading(false);
    }
  }, [id]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => {
      const newFiles = [...prev.images, ...acceptedFiles].slice(0, 10); // Limit to 10 images
      return { ...prev, images: newFiles };
    });
    
    // Create previews for new images
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
    multiple: true,
  });

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const newExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExisting);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(newPreviews);
    } else {
      // Find the index in all previews (existing + new)
      const actualIndex = existingImages.length + index;
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
      const newPreviews = imagePreviews.filter((_, i) => i !== actualIndex);
      setImagePreviews(newPreviews);
    }
  };

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

  const handleInputChange = (field: keyof Omit<ServiceFormData, "images">, value: string | number) => {
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
      console.log("Service updated:", {
        ...formData,
        images: formData.images.map((img) => img.name),
        existingImages: existingImages,
      });
      
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
            <Label htmlFor="price">Price ($) *</Label>
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

        {/* Image Upload Section */}
        <div className="space-y-4">
          <Label>Service Images (max 10 images)</Label>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Existing Images:
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Existing ${index + 1}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error-500 text-white opacity-0 transition-opacity hover:bg-error-600 group-hover:opacity-100"
                    >
                      <TrashBinIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 transition-colors ${
              isDragActive
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                : "border-gray-300 bg-gray-50 hover:border-brand-400 dark:border-gray-700 dark:bg-gray-900"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <PlusIcon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? "Drop images here" : "Drag & drop images here"}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  or click to browse (PNG, JPG, WebP)
                </p>
              </div>
            </div>
          </div>

          {/* New Image Previews */}
          {formData.images.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Images:
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {imagePreviews.slice(existingImages.length).map((preview, index) => (
                  <div key={existingImages.length + index} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error-500 text-white opacity-0 transition-opacity hover:bg-error-600 group-hover:opacity-100"
                    >
                      <TrashBinIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {imagePreviews.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {imagePreviews.length} image(s) total
            </p>
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
            {isSubmitting ? "Updating..." : "Update Service"}
          </button>
        </div>
      </Form>
    </ComponentCard>
    </>
  );
}

