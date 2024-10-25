import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeam, ITeam } from './service/team.service';
import { useUserStore } from '@/store/states/userSlice';

const Team = () => {
  const [team, setTeam] = useState<ITeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useUserStore();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const userId = user._id;
        const accessToken = token;

        if (userId && accessToken) {
          const teamData = await getTeam(userId, accessToken); 
          setTeam(teamData);
        } else {
          setError('No se encontraron las credenciales del usuario.');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user, token]);

  if (loading) {
    return <div>Cargando equipo...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-screen m-4 p-2">
      <Card className="w-full p-4 bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle>{team?.name || 'Nombre del equipo no disponible'}</CardTitle>
          <CardDescription>
            Código de Invitación: {team?.codeInvitation || 'No disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {team ? `Este equipo fue creado el ${new Date(team.createdAt).toLocaleDateString()}.` : 'Información no disponible'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          
        </CardFooter>
      </Card>
    </div>
  );
};

export default Team;
