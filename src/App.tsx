import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import Bookings from "./pages/Bookings/Bookings";
import CreateBooking from "./pages/Bookings/CreateBooking";
import EditBooking from "./pages/Bookings/EditBooking";
import Services from "./pages/Services/Services";
import CreateService from "./pages/Services/CreateService";
import EditService from "./pages/Services/EditService";
import Customers from "./pages/Customers/Customers";
import CreateCustomer from "./pages/Customers/CreateCustomer";
import EditCustomer from "./pages/Customers/EditCustomer";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import BookingDetails from "./pages/Bookings/BookingDetails";
import ServiceDetails from "./pages/Services/ServiceDetails";
import UserDetails from "./pages/Users/UserDetails";
import StaffDetails from "./pages/Staff/StaffDetails";
import Staffs from "./pages/Staff/Staffs";
import CreateStaff from "./pages/Staff/CreateStaff";
import EditStaff from "./pages/Staff/EditStaff";
import Users from "./pages/Users/Users";
import CreateUser from "./pages/Users/CreateUser";
import EditUser from "./pages/Users/EditUser";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import BookingDashboard from "./pages/Dashboard/BookingDashboard";
import Reports from "./pages/Reports/Reports";
import CorporationSetup from "./pages/CorporationSetup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CorporationSetupModal from "./components/modals/CorporationSetupModal";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <CorporationSetupModal />
          <ScrollToTop />
          <Routes>
          {/* Dashboard Layout - Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<BookingDashboard />} />
            <Route path="/dashboard" element={<BookingDashboard />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/new" element={<CreateBooking />} />
            <Route path="/bookings/edit/:id" element={<EditBooking />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/new" element={<CreateService />} />
            <Route path="/services/edit/:id" element={<EditService />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<CreateCustomer />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/staff" element={<Staffs />} />
            <Route path="/staff/new" element={<CreateStaff />} />
            <Route path="/staff/edit/:id" element={<EditStaff />} />
            <Route path="/staff/:id" element={<StaffDetails />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/new" element={<CreateUser />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/blank" element={<Blank />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Corporation Setup */}
            <Route path="/corporation-setup" element={<CorporationSetup />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
