import { useState } from "react";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { LayoutGrid } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { UserItem, TeamItem, SensorItem, ConectionItem } from "./components";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  members: number;
  createdAt: string;
}

const Dashboard = () => {
  const [user] = useState<User>({
    id: "123",
    name: "Daniel",
    email: "daniel@example.com",
    role: "admin",
  });

  const [team] = useState<Team>({
    id: "456",
    name: "Equipo Alpha",
    members: 5,
    createdAt: "2024-03-01T12:00:00Z",
  });

  return (
    <ContentLayout title="Dashboard" icon={<LayoutGrid />}>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[22rem]">
        <UserItem user={user} />
        <TeamItem team={team} />
        <SensorItem teamId={team.id} />
        <ConectionItem />
      </BentoGrid>
    </ContentLayout>
  );
};

export default Dashboard;
