import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/personal-banking", label: "Personal" },
    { path: "/wealth-management", label: "Wealth" },
    { path: "/business-banking", label: "Business" },
    { path: "/corporate-banking", label: "Corporate" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(item.path)}
              className={`px-6 ${
                location.pathname === item.path
                  ? "bg-[hsl(var(--commerce-green))] text-white hover:bg-[hsl(var(--commerce-green))]"
                  : "text-gray-600 hover:text-[hsl(var(--commerce-green))]"
              }`}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
