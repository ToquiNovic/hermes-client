// @/pages/dashboard/dashboardPage.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { LayoutGrid } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { UserItem, TeamItem, SensorItem, ConectionItem } from "./components";
import { User } from "@supabase/supabase-js";
import { SupabaseUser } from "@/models";

const Dashboard = () => {
  const user: User | null = useSelector((state: RootState) => state.supabase.user);

  const supabaseUser: SupabaseUser | null = user
    ? {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || "Usuario desconocido",
        image: user.user_metadata?.avatar_url || "",
        teamId: user.user_metadata?.team_id || "",
      }
    : null;

    console.log('supabaseUser', supabaseUser);

  return (
    <ContentLayout title="Dashboard" icon={<LayoutGrid />}>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[22rem]">
        {supabaseUser && <UserItem supabaseUser={supabaseUser} />}
        {supabaseUser && <TeamItem supabaseUser={supabaseUser} />}
        {supabaseUser && <SensorItem teamId={supabaseUser.teamId} />}
        {supabaseUser && <ConectionItem supabaseUser={supabaseUser} />}
      </BentoGrid>
    </ContentLayout>
  );
};

export default Dashboard;
