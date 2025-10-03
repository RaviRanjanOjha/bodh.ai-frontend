import { useContext } from "react";
import { UploadContext } from "../contexts/UploadContext";

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  return context;
};
