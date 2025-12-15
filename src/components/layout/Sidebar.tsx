import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ChevronLeft,
  ChevronRight,
  Link,
  Rocket,
  Grid3x3,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    name: "Liste des posts", 
    href: "/posts", 
    icon: Link 
  },
  { 
    name: "Lead Magnet", 
    href: "/lead-magnet", 
    icon: Rocket 
  },
  { 
    name: "Paramètres", 
    href: "/settings", 
    icon: Grid3x3 
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userType, signOut, user } = useUser();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-card border-r border-border flex flex-col h-screen transition-all duration-300`}>
      {/* Header */}
      <div className="relative p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <Logo collapsed={collapsed} />
          ) : (
            <div className="flex justify-center w-full">
              <Logo collapsed={collapsed} />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-sm hover:bg-secondary transition-all duration-300 hover:shadow-glow ml-auto"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
        {!collapsed && userType && (
          <div className="mt-3 flex flex-col gap-1">
            <Badge variant="secondary" className="text-xs w-fit">
              {userType === "bapt" ? "Baptiste" : "Imrane"}
            </Badge>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        )}
        {/* Bouton pour rouvrir la sidebar quand elle est fermée */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute top-4 -right-3 p-1.5 rounded-full bg-card border border-border hover:bg-secondary transition-all duration-300 hover:shadow-glow z-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`
            }
          >
            <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
        
        {!collapsed && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>LinkedIn Accelerator</span>
            <span className="text-primary">v1.0</span>
          </div>
        )}
      </div>
    </div>
  );
}