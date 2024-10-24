// FirstStepForm.tsx
import { FC, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "./Schema"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFormStore from '@/store/states/useFormStore';

interface FirstStepFormProps {
  onNextStep: () => void;
}

export const FirstStepForm: FC<FirstStepFormProps> = ({ onNextStep }) => {
  const [loading, setLoading] = useState(false);
  const formStore = useFormStore(); // Usamos el store para guardar los datos del usuario

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    // Guardamos los datos de usuario en el store
    formStore.setUsernameAndPassword({
      username: values.username,
      password: values.password,
    });
    onNextStep(); // Avanzamos al siguiente paso
    setLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
      <Input placeholder="Nombre de usuario" {...form.register('username')} />
      <Input type="password" placeholder="Contraseña" {...form.register('password')} />
      <Input type="password" placeholder="Confirmar contraseña" {...form.register('confirmPassword')} />
      <Button type="submit" disabled={loading} className="w-full bg-green-600">
        {loading ? 'Registrando...' : 'Siguiente'}
      </Button>
    </form>
  );
};
