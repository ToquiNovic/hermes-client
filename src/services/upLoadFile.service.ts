// @/services/upLoadFile.service.ts
import axios from "axios";

interface UploadFileParams {
  file: File;
  tipo: string;
  id: string;
}

export const uploadFile = async ({ file, tipo, id }: UploadFileParams) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo", tipo);
  formData.append("id", id);

  const response = await axios.post("/api/uploadfile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};