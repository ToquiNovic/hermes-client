// @/pages/sensor/sensorPage.tsx
import { useCallback, useEffect, useState } from "react";
import { getSensorsByTeam } from "./service";
import { Sensor, Team } from "@/models";
import { useUser } from "@/hooks";
import { useAuth } from "@/context";
import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, UtilityPole, Plus } from "lucide-react";
import { SensorCard } from "./components";
import { cn } from "@/lib/utils";
import { SensorDialog } from "./components";
import { getTeamById } from "@/services";

export const SensorsPage = () => {
  const { user } = useAuth();
  const { userData, loading, error } = useUser(user?.id || "");
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const teamIdUser = userData?.teamId || "";
  const [team, setTeam] = useState<Team | null>(null);

  const fetchSensors = useCallback(async () => {
    if (!userData?.teamId || loading) {
      console.log("No se puede obtener los sensores: ", {
        teamId: userData?.teamId,
        loading,
      });
      return;
    }

    if (!team) {
      const teamResponse = await getTeamById(userData.teamId);
      if (teamResponse?.success && teamResponse.data) {
        setTeam(teamResponse.data);
      } else {
        setTeam(null);
      }
    }

    try {
      const sensorData = await getSensorsByTeam(userData.teamId);
      setSensors(sensorData);
    } catch (err) {
      console.error("Error fetching sensors:", err);
    }
  }, [userData?.teamId, loading, team]);

  useEffect(() => {
    if (userData?.teamId && !loading) {
      fetchSensors();
    }
  }, [fetchSensors, userData, loading]);

  return (
    <ContentLayout title="Sensores" icon={<UtilityPole />}>
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className={cn("text-2xl font-bold flex items-center gap-x-2")}>
            <ChevronRight />
            {loading
              ? "Cargando..."
              : error
              ? "Error"
              : userData?.name || "Sensores"}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>

        {/* Grid de Sensores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                token={team?.token || ""}
                onDelete={() => {}}
              />
            ))
          ) : (
            <Card
              className="cursor-pointer hover:bg-muted transition"
              onClick={() => setDialogOpen(true)}
            >
              <CardContent className="flex items-center justify-center p-4 gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-lg">Crear nuevo sensor</span>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog para agregar sensor */}
      <SensorDialog
        idTeam={teamIdUser}
        open={dialogOpen}
        setOpen={setDialogOpen}
        onNewSensor={fetchSensors}
      />
    </ContentLayout>
  );
};
