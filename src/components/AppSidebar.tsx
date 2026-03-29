import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut, Compass, Sparkles, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";
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
  useSidebar,
} from "@/components/ui/sidebar";

const MOCK_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Plan a Trip", url: "/plan", icon: Compass },
  { title: "Profile Settings", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigation = (url: string) => {
    navigate(url);
    if (isMobile) setOpenMobile(false);
  };

  const handleSignout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-border/10 shadow-sm bg-card/60 backdrop-blur-xl z-40" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border/10">
        <Link to="/" className="flex items-center gap-3 group px-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-data-[collapsible=icon]:hidden">
            Trip Weaver
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2 px-4 group-data-[collapsible=icon]:hidden">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {MOCK_ITEMS.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      onClick={() => handleNavigation(item.url)}
                      className={`h-11 px-3 rounded-lg transition-all border border-transparent ${
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground border-primary/20" 
                          : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <button className="flex items-center gap-3 w-full cursor-pointer">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/10 space-y-2">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme} className="h-11 px-3 w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
              {theme === "light" ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
              <span className="group-data-[collapsible=icon]:hidden">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignout} className="h-11 px-3 w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-500/20">
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
