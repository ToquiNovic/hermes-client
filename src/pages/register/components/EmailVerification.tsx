import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";

interface EmailVerificationProps {
  email: string;
}

export default function EmailVerification({ email }: EmailVerificationProps) {
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResendDisabled(true);
    setCountdown(30); // Reinicia la cuenta regresiva

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/complete-profile`,
      },
    });

    if (error) {
      toast.error("Error al reenviar el correo: " + error.message);
    } else {
      toast.success("Correo de verificación reenviado.");
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Verifica tu correo</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>
          Hemos enviado un enlace de verificación a <b>{email}</b>.<br />
          Por favor, revisa tu correo y confirma tu cuenta antes de continuar.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleResendEmail} disabled={resendDisabled} variant="outline">
          {resendDisabled ? `Espera ${countdown}s...` : "Reenviar correo"}
        </Button>
      </CardFooter>
    </Card>
  );
}
