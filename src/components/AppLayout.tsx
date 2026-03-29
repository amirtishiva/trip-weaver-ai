import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 w-full min-w-0 h-full overflow-hidden relative">
          {/* Mobile Header triggered only on small screens */}
          <header className="md:hidden flex h-16 shrink-0 items-center justify-between px-4 fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-foreground" />
              <div className="font-heading font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Travel Wonders
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0 pb-16 relative perspective-1000">
             {/* Subtle ambient lighting for the main app background */}
             <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-[200px] -translate-y-[200px]"></div>
             <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none -translate-x-[150px] translate-y-[150px]"></div>
             {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
