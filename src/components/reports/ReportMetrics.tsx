import { useMemo } from "react";
import { Booking } from "../tables/Bookings/BookingTable";
import { Service } from "../tables/Services/ServiceTable";
import { DollarLineIcon, CalenderIcon } from "../../icons";

// Generate dummy bookings data
const generateDummyBookings = (): Booking[] => {
  const customerNames = [
    "Fakhrul", "John Doe", "Jane Smith", "Bob Johnson", "Alice Williams",
    "Charlie Brown", "Diana Prince", "Edward Lee", "Fiona Green", "George Wilson",
    "Hannah Kim", "Isaac Newton", "Julia Roberts", "Kevin Hart", "Lisa Anderson",
    "Michael Scott", "Nancy Drew", "Oliver Twist", "Patricia Star", "Quinn Taylor",
    "Rachel Green", "Steve Jobs", "Tina Turner", "Uma Thurman", "Victor Chen",
    "Wendy Davis", "Xavier Wood", "Yara Martinez", "Zoe Johnson", "Adam Smith",
    "Bella Swan", "Chris Evans", "Diana Ross", "Ethan Hunt", "Faith Hill",
    "Grace Kelly", "Harry Potter", "Iris West", "Jack Sparrow", "Kate Winslet",
    "Leo DiCaprio", "Mia Wallace", "Noah Smith", "Olivia Pope", "Paul Walker",
    "Quincy Jones", "Rose Tyler", "Sam Wilson", "Tara Reid", "Ulysses Grant"
  ];

  const customerEmails = customerNames.map(name => 
    `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
  );

  const staffNames = ["Ahmad", "Sarah", "Mike", "Emma", "David"];
  const services = ["Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo"];
  const statuses: ("confirmed" | "pending" | "cancelled" | "completed")[] = [
    "confirmed", "pending", "cancelled", "completed"
  ];
  
  const times = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const bookings: Booking[] = [];
  
  const today = new Date();
  const dates: string[] = [];
  for (let i = -30; i <= 15; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  for (let i = 0; i < 50; i++) {
    const randomDateIndex = Math.floor(Math.random() * dates.length);
    const randomTimeIndex = Math.floor(Math.random() * times.length);
    const randomStatusIndex = Math.floor(Math.random() * statuses.length);
    const randomStaffIndex = Math.floor(Math.random() * staffNames.length);
    const randomServiceIndex = Math.floor(Math.random() * services.length);
    
    bookings.push({
      _id: (i + 1).toString(),
      customer_name: customerNames[i % customerNames.length],
      customer_email: customerEmails[i % customerEmails.length],
      staff_name: staffNames[randomStaffIndex],
      service_name: services[randomServiceIndex],
      date: dates[randomDateIndex],
      time: times[randomTimeIndex],
      status: statuses[randomStatusIndex],
    });
  }

  return bookings;
};

// Generate dummy services data
const generateDummyServices = (): Service[] => {
  const serviceNames = [
    "Haircut", "Hair Color", "Hair Styling", "Beard Trim", "Shampoo",
    "Hair Extension", "Hair Treatment", "Hair Wash", "Hair Cut & Style",
    "Hair Coloring", "Full Haircut", "Hair Spa", "Hair Straightening",
  ];

  const durations = [15, 30, 45, 60, 90, 120];
  const prices = [15, 25, 35, 50, 75, 100, 150, 200];

  const services: Service[] = [];
  
  for (let i = 0; i < 18; i++) {
    const randomDurationIndex = Math.floor(Math.random() * durations.length);
    const randomPriceIndex = Math.floor(Math.random() * prices.length);
    
    services.push({
      _id: (i + 1).toString(),
      name: serviceNames[i % serviceNames.length],
      duration_minutes: durations[randomDurationIndex],
      price: prices[randomPriceIndex],
    });
  }

  return services;
};

export default function ReportMetrics() {
  const bookingData = useMemo(() => generateDummyBookings(), []);
  const serviceData = useMemo(() => generateDummyServices(), []);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Total Revenue - sum of all completed/confirmed bookings
    const completedBookings = bookingData.filter(
      (b) => b.status === "completed" || b.status === "confirmed"
    );
    
    // Create a service price map
    const servicePriceMap = new Map<string, number>();
    serviceData.forEach((service) => {
      servicePriceMap.set(service.name, service.price);
    });

    let totalRevenue = 0;
    completedBookings.forEach((booking) => {
      const price = servicePriceMap.get(booking.service_name) || 0;
      totalRevenue += price;
    });

    // Total Bookings
    const totalBookings = bookingData.length;

    // Average Booking Value
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Cancellation Rate
    const cancelledBookings = bookingData.filter((b) => b.status === "cancelled").length;
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    return {
      totalRevenue,
      totalBookings,
      averageBookingValue,
      cancellationRate,
    };
  }, [bookingData, serviceData]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Revenue
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            RM {metrics.totalRevenue.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Total Bookings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Bookings
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {metrics.totalBookings.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Average Booking Value */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Average Booking Value
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            RM {metrics.averageBookingValue.toFixed(2)}
          </h4>
        </div>
      </div>

      {/* Cancellation Rate */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Cancellation Rate
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {metrics.cancellationRate.toFixed(1)}%
          </h4>
        </div>
      </div>
    </div>
  );
}

