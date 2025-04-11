
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ActivitySquare, ClipboardList, History, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: Users,
    },
    {
      title: "Mesures",
      url: "/mesures",
      icon: ActivitySquare,
    },
    {
      title: "Historique",
      url: "/historique",
      icon: History,
    },
    {
      title: "Rapports",
      url: "/rapports",
      icon: ClipboardList,
    },
    {
      title: "Paramètres",
      url: "/parametres",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Déconnecté avec succès",
      description: "À bientôt",
    });
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-6">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-medical-primary flex items-center justify-center">
            <ActivitySquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">VitalView</span>
        </div>
        <SidebarTrigger className="ml-auto md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={
                      location.pathname === item.url
                        ? "bg-medical-accent text-medical-primary font-medium"
                        : ""
                    }
                    asChild
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
