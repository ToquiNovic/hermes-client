import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "./services/register.service.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EmailVerification from "./components/EmailVerification";

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
      if (user) setVerificationSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    }

    setLoading(false);
  };

  if (verificationSent) return <EmailVerification email={email} />;

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

        {/* Separador */}
        <div className="my-4">
          <Separator />
        </div>

        {/* Enlace a login */}
        <p className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-primary">
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
