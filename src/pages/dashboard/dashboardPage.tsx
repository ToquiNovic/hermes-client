// @/pages/dashboard/dashboardPage.tsx
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
import { SupabaseUser } from "@/models";
import { useUser } from "@/hooks";
import { useEffect } from "react";

const Dashboard = () => {
  const user: User | null = useSelector(
    (state: RootState) => state.supabase.user
  );
  const { userData, loading, error } = useUser(user?.id || "");
  const teamId = useSelector((state: RootState) => state.supabase.user?.teamId);

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const supabaseUser: SupabaseUser | null = user
    ? {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || "Usuario desconocido",
        image: user.user_metadata?.avatar_url || "",
        teamId: teamId || "",
      }
    : null;

  return (
    <ContentLayout title="Dashboard" icon={<LayoutGrid />}>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[22rem]">
        {supabaseUser && <UserItem supabaseUser={supabaseUser} />}

        {supabaseUser?.teamId ? (
          <TeamItem supabaseUser={supabaseUser} />
        ) : (
          supabaseUser && <CreateTeam supabaseUser={supabaseUser} />
        )}

        {supabaseUser?.teamId && <SensorItem teamId={supabaseUser.teamId} />}
        {supabaseUser?.teamId && <ConectionItem supabaseUser={supabaseUser} />}
      </BentoGrid>
    </ContentLayout>
  );
};

export default Dashboard;
