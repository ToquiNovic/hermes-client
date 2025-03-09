// src/pages/register/components/ProfileImage.tsx
import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/useImageUpload";
import { updateUser } from "@/pages/register/services/register.service";

interface ProfileImageProps {
  avatarUrl: string;
  tipo: string;
  id: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileImage({
  avatarUrl,
  tipo,
  id,
}: ProfileImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { upload, isUploading, uploadedUrl, setUploadedUrl } = useImageUpload();

  useEffect(() => {
    setUploadedUrl(avatarUrl);
  }, [avatarUrl, setUploadedUrl]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Solo se permiten imágenes en formato PNG o JPG.");
      return;
    }

    const url = await upload(file, tipo, id);
    if (url) {
      try {
        // Actualizar usuario con la nueva imagen
        const updatedUser = await updateUser(id, { imageUrl: url });

        if (updatedUser) {
          setUploadedUrl(url);
          toast.success("Imagen actualizada con éxito!");
        } else {
          toast.error("No se pudo actualizar la imagen en el perfil.");
        }
      } catch (error) {
        console.error("Error al actualizar el perfil del usuario:", error);
        toast.error("Error al actualizar el perfil del usuario.");
      }
    } else {
      toast.error("Hubo un error al subir la imagen.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 relative">
      <div className="relative group">
        {/* Imagen de perfil con loader si está subiendo */}
        <Avatar className="w-24 h-24 border cursor-pointer">
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
              ⏳
            </div>
          ) : (
            <AvatarImage
              src={uploadedUrl || avatarUrl}
              alt="Avatar"
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-gray-300 text-gray-500">
            { }
          </AvatarFallback>
        </Avatar>

        {/* Overlay con botón de cambio */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleImageClick}
            disabled={isUploading}
          >
            {isUploading ? "Subiendo..." : "Cambiar"}
          </Button>
        </div>
      </div>

      {/* Input de archivo oculto */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
