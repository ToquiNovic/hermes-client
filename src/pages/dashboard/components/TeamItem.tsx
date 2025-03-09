import { BentoGridItem } from "@/components/ui/bento-grid";
import { FileWarning } from "lucide-react";

interface Team {
  id: string;
  name: string;
  members: number;
  createdAt: string;
}

interface TeamItemProps {
  team: Team;
}

const TeamItem = ({ team }: TeamItemProps) => {
  return (
    <BentoGridItem
      title={`Equipo: ${team.name}`}
      description={`Miembros: ${team.members} | Creado el: ${new Date(team.createdAt).toLocaleDateString()}`}
      header={
        <div className="flex flex-1 items-center justify-center min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2]">
          🏆 {team.name}
        </div>
      }
      className="md:col-span-1"
      icon={<FileWarning className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default TeamItem;
