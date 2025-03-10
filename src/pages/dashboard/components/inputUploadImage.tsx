// @/pages/Company/components/inputUploadImage.tsx
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface InputUploadImageProps {
  id: string;
  tipo: string;
  onUploadComplete: (url: string | null, extension: string) => void;
}

const InputUploadImage: React.FC<InputUploadImageProps> = ({ id, tipo, onUploadComplete }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { upload, isUploading } = useImageUpload();

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const localUrl = URL.createObjectURL(file);
      const fileExtension = file.name.split(".").pop() || "";

      setPreviewUrl(localUrl);

      // Subir la imagen a la nube
      const uploadedUrl = await upload(file, tipo, id);
      onUploadComplete(uploadedUrl, fileExtension);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/png": [], "image/jpeg": [] },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:border-blue-500 transition"
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <img
            src={previewUrl}
            alt="Imagen seleccionada"
            className="h-32 w-32 object-cover rounded-md"
          />
          <p className="text-gray-500 text-sm mt-2">
            {isUploading ? "Subiendo imagen..." : "Haz clic para cambiar la imagen"}
          </p>
        </div>
      ) : (
        <>
          <UploadCloud className="mx-auto mb-2 text-gray-500" size={32} />
          {isDragActive ? (
            <p className="text-gray-700">Suelta la imagen aquí...</p>
          ) : (
            <p className="text-gray-500">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default InputUploadImage;