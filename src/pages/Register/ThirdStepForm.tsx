import { FC } from 'react';
import { Button } from '@/components/ui/button';
import useFormStore from '@/store/states/useFormStore';
import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

interface ThirdStepFormProps {
  onPrevious: () => void;
  onFinish: () => void;
}

export const ThirdStepForm: FC<ThirdStepFormProps> = ({ onPrevious, onFinish }) => {
  const formStore = useFormStore();
  const { username, role, teamName, inviteCode } = formStore;
  const navigate = useNavigate(); // Hook para redireccionar

  const handleFinish = () => {
    // Usamos startTransition para evitar el error de suspensión
    startTransition(() => {
      onFinish(); // Si onFinish tiene algún propósito adicional
      navigate('/login'); // Redirigir a la vista de login
    });
  };

  return (
    <div className="space-y-8 w-full max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Registro Completo</h3>
        <p>Username: {username}</p>
        <p>Role: {role}</p>
        <p>Team Name: {teamName}</p>
        <p>Invite Code: {inviteCode}</p> 
      </div>

      <div className="w-full flex justify-between mt-6">
        <Button variant="outline" onClick={onPrevious}>Anterior</Button>
        <Button size="sm" className="bg-green-600" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
};
