import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { LayoutGrid } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import {
  UserItem,
  TeamItem,
  SensorItem,
  ConectionItem,
  CreateTeam,
} from "./components";
import { User } from "@supabase/supabase-js";
import { useUser } from "@/hooks";
import { SupabaseUser } from "@/models";
import { useState, useCallback } from "react";

const Dashboard = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Clave para forzar refetch

  const user: User | null = useSelector(
    (state: RootState) => state.supabase.user
  );
  const storedTeamId = useSelector(
    (state: RootState) => state.supabase.user?.teamId
  );
  const { userData, loading, error } = useUser(user?.id || "", refreshKey); // Pasa refreshKey a useUser

  const teamId = userData?.teamId || storedTeamId || "";

  const handleTeamLeave = useCallback(() => {
    setRefreshKey((prev) => prev + 1); // Incrementa refreshKey para forzar refetch
  }, []);

  if (!user || loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const supabaseUser: SupabaseUser = {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.full_name || "Usuario desconocido",
    image: userData?.imageUrl || user.user_metadata?.avatar_url || "",
    teamId,
  };

  return (
    <ContentLayout title="Dashboard" icon={<LayoutGrid />}>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[22rem]">
        <UserItem supabaseUser={supabaseUser} />
        {teamId ? (
          <>
            <div
              onMouseEnter={() => setHoveredItem("team")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <TeamItem
                supabaseUser={supabaseUser}
                isHovered={hoveredItem === "team"}
                onTeamLeave={handleTeamLeave} // Pasa el callback
              />
            </div>
            <SensorItem teamId={teamId} />
            <ConectionItem supabaseUser={supabaseUser} />
          </>
        ) : (
          <CreateTeam />
        )}
      </BentoGrid>
    </ContentLayout>
  );
};

export default Dashboard;
