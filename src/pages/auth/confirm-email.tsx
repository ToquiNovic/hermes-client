import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { Spinner } from "@/components";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Token de confirmación no válido.");
        navigate("/");
        return;
      }

      // Obtener el email del usuario autenticado
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user?.email) {
        toast.error("No se pudo obtener el correo del usuario.");
        navigate("/");
        return;
      }

      const email = userData.user.email;

      // Verificar el correo con el token
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        email, // Se agrega el email requerido
        token,
      });

      if (error) {
        toast.error("Error confirmando correo: " + error.message);
      } else {
        toast.success(
          "Correo confirmado con éxito. ¡Ahora puedes iniciar sesión!"
        );
      }

      setLoading(false);
      navigate("/login");
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? <Spinner /> : <p>Redirigiendo...</p>}
    </div>
  );
}
