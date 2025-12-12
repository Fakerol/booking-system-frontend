import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { Booking } from "../tables/Bookings/BookingTable";

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

export default function BookingStatusPieChart() {
  const bookingData = useMemo(() => generateDummyBookings(), []);

  // Calculate booking status breakdown
  const statusBreakdown = useMemo(() => {
    const statusCounts: Record<string, number> = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
    };

    bookingData.forEach((booking) => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));
  }, [bookingData]);

  const options: ApexOptions = {
    colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "pie",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    labels: statusBreakdown.map((s) => s.status),
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
      fontSize: "14px",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number, { seriesIndex }) => {
          const total = statusBreakdown.reduce((sum, s) => sum + s.count, 0);
          const count = statusBreakdown[seriesIndex].count;
          return `${count} bookings (${val.toFixed(1)}%)`;
        },
      },
    },
  };

  const series = statusBreakdown.map((s) => s.count);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Booking Status Breakdown
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Distribution of booking statuses
        </p>
      </div>

      <Chart options={options} series={series} type="pie" height={300} />
    </div>
  );
}

