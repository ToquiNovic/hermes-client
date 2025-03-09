// @/hooks/useImageUpload.ts
import { useState } from "react";
import { uploadFile } from "@/services";

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const upload = async (file: File, tipo: string, id: string): Promise<string | null> => {
    setIsUploading(true);
    try {
      const response = await uploadFile({ file, tipo, id });      
      setUploadedUrl(response.url);
      return response.url;
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      setUploadedUrl(null);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, uploadedUrl, setUploadedUrl };
};
