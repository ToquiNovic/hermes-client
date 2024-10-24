import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RegisterSchema } from "./Schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "./services";
import { toast } from 'sonner';

export const Register = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      // Llamar a registerUser con los datos del formulario
      await registerUser(values.username, values.password, "student");
      
      toast.success("Account created successfully!");
  
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        form.setError("username", { type: "manual", message: error.message });
        toast.error("Error during registration");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md bg-white shadow-lg p-10 rounded-lg"
        >
          <div className="flex items-center justify-center">
            <span className="text-2xl font-semibold">Crear Cuenta</span>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="sm" className="bg-green-600 w-full" type="submit">
              Crear Cuenta
            </Button>
          </div>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">¿Ya tienes cuenta?</span>
            <Link to="/login" className="text-blue-500 hover:underline ml-1">
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
