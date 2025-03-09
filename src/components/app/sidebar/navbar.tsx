// @/components/app/sidebar/navbar.tsx
import { ModeToggle } from "@/components/mode-toggle";

interface NavbarProps {
  title?: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title, icon }) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <div className="flex items-center gap-2"> 
            {icon && <span className="text-xl">{icon}</span>} 
            <h1 className="font-bold">{title}</h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
