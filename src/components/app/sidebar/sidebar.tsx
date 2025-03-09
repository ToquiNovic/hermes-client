import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks"; 
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom"; 
import Logo from "/metasync-logo.webp"; 

export function Sidebar() {
  const sidebar = useSidebar();

  if (!sidebar) return null;

  const { isOpen, toggleOpen, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !isOpen ? "w-[90px]" : "w-72",
        settings?.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            !isOpen ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-8 h-8 mr-1" /> 
          </Link>
        </Button>
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  );
}
