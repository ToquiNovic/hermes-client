// @/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Navbar } from "@/components/app/sidebar/navbar";

export const PublicLayout = () => (
  <div className="min-h-screen flex flex-col relative overflow-hidden">
    <div className="absolute inset-0 -z-10 w-full h-full">
      <BackgroundLines className="w-full h-full" />
    </div>

    <Navbar />
    
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-16 relative z-10">
      <Outlet />
    </div>

    <footer className="w-full py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
      <h1 className="font-semibold text-xs sm:text-sm md:text-base">
        <a
          href="https://github.com/toquinovic"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-600 transition-colors duration-200"
        >
          Daniel Toquica © {new Date().getFullYear()}
        </a>
      </h1>
    </footer>
  </div>
);

export default PublicLayout;
