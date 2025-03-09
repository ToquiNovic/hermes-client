import { useState } from "react";
import { registerUser, loginWithGoogle } from "./services/register.service.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailVerification from "./components/EmailVerification";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await registerUser(email, password);

      if (user) {
        setVerificationSent(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Error al iniciar sesión con Google: " + err.message);
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }

    setLoading(false);
  };

  if (verificationSent) {
    return <EmailVerification email={email} />;
  }

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Registro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Cargando..." : "Continuar con Google"}
        </Button>
      </CardContent>
    </Card>
  );
}
