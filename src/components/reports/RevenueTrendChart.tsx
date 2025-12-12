import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import { Booking } from "../tables/Bookings/BookingTable";
import { Service } from "../tables/Services/ServiceTable";

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
  ];

  const prices = [15, 25, 35, 50, 75];

  const services: Service[] = [];
  
  for (let i = 0; i < 5; i++) {
    services.push({
      _id: (i + 1).toString(),
      name: serviceNames[i],
      duration_minutes: 30,
      price: prices[i],
    });
  }

  return services;
};

export default function RevenueTrendChart() {
  const bookingData = useMemo(() => generateDummyBookings(), []);
  const serviceData = useMemo(() => generateDummyServices(), []);

  // Calculate revenue trend (last 7 days)
  const revenueTrend = useMemo(() => {
    const servicePriceMap = new Map<string, number>();
    serviceData.forEach((service) => {
      servicePriceMap.set(service.name, service.price);
    });

    const today = new Date();
    const last7Days: { date: string; revenue: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayBookings = bookingData.filter(
        (b) => b.date === dateStr && (b.status === "completed" || b.status === "confirmed")
      );

      let dayRevenue = 0;
      dayBookings.forEach((booking) => {
        const price = servicePriceMap.get(booking.service_name) || 0;
        dayRevenue += price;
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
      });
    }

    return last7Days;
  }, [bookingData, serviceData]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: revenueTrend.map((d) => d.date),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Revenue (RM)",
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      labels: {
        formatter: (val: number) => `RM ${val}`,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `RM ${val.toFixed(2)}`,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: revenueTrend.map((d) => d.revenue),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue Trend
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revenue over the last 7 days
        </p>
      </div>

      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}

