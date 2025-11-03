import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { ChevronLeftIcon, AngleRightIcon } from "../../../icons";
import ServiceDetailsModal from "../../modals/ServiceDetailsModal";
import Toast from "../../ui/toast/Toast";

export interface Service {
  _id: string;
  name: string;
  duration_minutes: number;
  price: number;
  images: string[];
}

// Generate 30 dummy services
const generateDummyServices = (): Service[] => {
  const serviceNames = [
    "Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo",
    "Hair Extension", "Hair Treatment", "Hair Wash", "Hair Cut & Style",
    "Hair Coloring", "Full Haircut", "Hair Spa", "Hair Straightening",
    "Hair Perm", "Hair Highlighting", "Hair Blow Dry", "Hair Braiding",
    "Hair Updo", "Hair Bleaching", "Hair Toning", "Hair Glazing",
    "Hair Conditioning", "Hair Scalp Treatment", "Hair Keratin Treatment",
    "Hair Frizz Control", "Hair Volumizing", "Hair Smoothing", "Hair Curling",
    "Hair Rebonding", "Hair Bonding"
  ];

  const durations = [15, 30, 45, 60, 90, 120];
  const prices = [15, 25, 35, 50, 75, 100, 150, 200];

  const services: Service[] = [];
  
  for (let i = 0; i < 30; i++) {
    const randomDurationIndex = Math.floor(Math.random() * durations.length);
    const randomPriceIndex = Math.floor(Math.random() * prices.length);
    const imageCount = Math.floor(Math.random() * 4) + 1; // 1-4 images
    
    services.push({
      _id: (i + 1).toString(),
      name: serviceNames[i % serviceNames.length],
      duration_minutes: durations[randomDurationIndex],
      price: prices[randomPriceIndex],
      images: Array.from({ length: imageCount }, (_, idx) => 
        `https://picsum.photos/200/200?random=${i}-${idx}`
      ),
    });
  }

  return services;
};

const serviceData: Service[] = generateDummyServices();

const ITEMS_PER_PAGE = 20;

export default function ServiceTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Filter services based on search and filters
  const filteredServices = useMemo(() => {
    return serviceData.filter((service) => {
      const matchesSearch =
        searchTerm === "" ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDuration = 
        durationFilter === "" || 
        service.duration_minutes.toString() === durationFilter;

      const matchesPrice = 
        priceFilter === "" || 
        service.price.toString() === priceFilter;

      return matchesSearch && matchesDuration && matchesPrice;
    });
  }, [searchTerm, durationFilter, priceFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, durationFilter, priceFilter]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleEdit = (serviceId: string) => {
    navigate(`/services/edit/${serviceId}`);
  };

  const handleDelete = (serviceId: string) => {
    // In a real app, this would call an API to delete the service
    console.log("Delete service:", serviceId);
    // For now, we'll just log it since we're using dummy data
    setShowToast(true);
    // In a real app, you would make an API call here
    // After successful deletion, show the toast
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // Get unique durations for filter
  const uniqueDurations = useMemo(() => {
    const durationSet = new Set(serviceData.map(s => s.duration_minutes.toString()));
    return Array.from(durationSet).sort((a, b) => parseInt(a) - parseInt(b));
  }, []);

  // Get unique prices for filter
  const uniquePrices = useMemo(() => {
    const priceSet = new Set(serviceData.map(s => s.price.toString()));
    return Array.from(priceSet).sort((a, b) => parseFloat(a) - parseFloat(b));
  }, []);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by service name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Duration Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (minutes)
            </label>
            <Select
              placeholder="All Durations"
              options={[
                { value: "", label: "All Durations" },
                ...uniqueDurations.map((duration) => ({
                  value: duration,
                  label: `${duration} min`,
                })),
              ]}
              defaultValue=""
              onChange={(value) => setDurationFilter(value)}
            />
          </div>

          {/* Price Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price ($)
            </label>
            <Select
              placeholder="All Prices"
              options={[
                { value: "", label: "All Prices" },
                ...uniquePrices.map((price) => ({
                  value: price,
                  label: `$${price}`,
                })),
              ]}
              defaultValue=""
              onChange={(value) => setPriceFilter(value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Service Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Duration
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Images
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service) => (
                  <TableRow 
                    key={service._id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td 
                      className="px-5 py-4 sm:px-6 text-start"
                      onClick={() => handleRowClick(service)}
                    >
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {service.name}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(service)}
                    >
                      {service.duration_minutes} min
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(service)}
                    >
                      ${service.price}
                    </td>
                    <td 
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      onClick={() => handleRowClick(service)}
                    >
                      <div className="flex gap-1">
                        {service.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${service.name} ${idx + 1}`}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ))}
                        {service.images.length > 3 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            +{service.images.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No services found matching your filters.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {startIndex + 1} to {Math.min(endIndex, filteredServices.length)}
            </span>{" "}
            of <span className="font-medium">{filteredServices.length}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      className="flex h-9 items-center px-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <AngleRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Success Toast */}
      <Toast
        message="Service deleted successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

