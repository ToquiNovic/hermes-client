import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "./Schema";
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
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services";
import { useUserStore } from '@/store/states';
import { toast } from 'sonner';

export const Login = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const user = await loginUser(values.username, values.password); 
      login(user);
      
      toast.success("Login successful!");
  
      navigate("/dashboard"); 
    } catch (error) {
      if (error instanceof Error) {
        form.setError("username", { type: "manual", message: error.message });
        toast.error("Error during login");
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md shadow-lg p-10 rounded-lg"
        >
          <div className="flex items-center justify-center">
            <span className="text-2xl">Iniciar Sesión</span>
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
          <div className="w-full flex justify-center">
            <Button size="sm" className="bg-green-600" type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
