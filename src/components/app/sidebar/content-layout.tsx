import { Navbar } from "@/components/app/sidebar/navbar";
import { Card } from "@/components/ui/card";

interface ContentLayoutProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function ContentLayout({ title, icon, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} icon={icon} />
        <Card className="flex-1 flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-16 relative z-10">
          {children}
        </Card>
    </div>
  );
}
