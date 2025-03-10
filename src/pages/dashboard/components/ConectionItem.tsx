import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { Copy } from "lucide-react";
import { UserItemProps, Team } from "@/models";
import { getTeamById } from "@/services";
import { useUser } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Importamos Sonner

const ConectionItem = ({ supabaseUser }: UserItemProps) => {
  const { userData, loading, error } = useUser(supabaseUser.id);
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!userData?.teamId) return;
      try {
        const response = await getTeamById(userData.teamId);

        if (response && response.success && response.data) {
          setTeam(response.data);
        } else {
          setTeam(null);
        }
      } catch {
        setTeam(null);
      }
    };

    fetchTeam();
  }, [userData]);

  // Función para copiar al portapapeles
  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiada al portapapeles!`);
  };

  if (loading) {
    return (
      <BentoGridItem
        title="Cargando..."
        description="Obteniendo datos del Equipo..."
      />
    );
  }

  if (error || !userData) {
    return (
      <BentoGridItem title="Error" description="No se pudo cargar el Equipo." />
    );
  }

  return (
    <BentoGridItem
      header={
        <div className="p-4 w-full">
          <CardHeader>
            <CardTitle>Project API</CardTitle>
            <CardDescription>
              Guarda tus claves de acceso y secreto para acceder a tus datos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-6">
            <div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                Public Key
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  value={team?.id || ""}
                  readOnly
                  className="truncate bg-neutral-200 dark:bg-neutral-800"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(team?.id || "", "Public Key")}
                >
                  <Copy className="h-4 w-4 text-neutral-500" />
                </Button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                Secret Key
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  value={team?.token || ""}
                  readOnly
                  className="truncate bg-neutral-200 dark:bg-neutral-800"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(team?.token || "", "Secret Key")}
                >
                  <Copy className="h-4 w-4 text-neutral-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      }
      className="md:col-span-2"
    />
  );
};

export default ConectionItem;
