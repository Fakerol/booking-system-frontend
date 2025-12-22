import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuth } from "../context/AuthContext";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { needsCorporationSetup } = useAuth();

  return (
    <div className="min-h-screen xl:flex">
      {!needsCorporationSetup && (
        <div>
          <AppSidebar />
          <Backdrop />
        </div>
      )}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          needsCorporationSetup
            ? "ml-0"
            : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {!needsCorporationSetup && <AppHeader />}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
