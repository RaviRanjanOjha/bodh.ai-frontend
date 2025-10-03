/**
 * Upload Context - Handles file upload functionality
 */
import React, { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { uploadDocuments } from "../services/api";
import { UPLOAD_STATUS, UI_CONFIG, ERROR_MESSAGES } from "../constants";
import { validateFile, formatFileSize } from "../utils/chatUtils";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadStatus, setUploadStatus] = useState(UPLOAD_STATUS.IDLE);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Validate multiple files
  const validateFiles = useCallback((files) => {
    const errors = [];
    const validFiles = [];

    Array.from(files).forEach((file, index) => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
      }
    });

    return { validFiles, errors };
  }, []);

  // Upload documents
  const onUploadDocument = useCallback(
    async (files) => {
      if (!files || files.length === 0) {
        setUploadError("No files selected");
        return null;
      }

      setUploadStatus(UPLOAD_STATUS.UPLOADING);
      setUploadError(null);
      setUploadProgress(0);

      try {
        // Validate files
        const { validFiles, errors } = validateFiles(files);

        if (errors.length > 0) {
          throw new Error(errors.join("\n"));
        }

        if (validFiles.length === 0) {
          throw new Error("No valid files to upload");
        }

        console.log(
          "📁 Uploading files:",
          validFiles.map((f) => f.name)
        );

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const next = prev + 10;
            if (next >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return next;
          });
        }, 100);

        // Upload files
        const result = await uploadDocuments(validFiles);

        // Complete progress
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (result && result.documents) {
          setUploadStatus(UPLOAD_STATUS.UPLOADED);
          setUploadedFiles((prev) => [...prev, ...result.documents]);

          console.log("📁 Upload successful:", result);

          // Reset progress after a delay
          setTimeout(() => {
            setUploadProgress(0);
          }, 2000);

          return result;
        } else {
          throw new Error("Invalid upload response");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError(error.message);
        setUploadStatus(UPLOAD_STATUS.ERROR);
        setUploadProgress(0);
        throw error;
      }
    },
    [validateFiles]
  );

  // Clear upload state
  const clearUploadState = useCallback(() => {
    setUploadStatus(UPLOAD_STATUS.IDLE);
    setUploadError(null);
    setUploadProgress(0);
  }, []);

  // Remove uploaded file from list
  const removeUploadedFile = useCallback((fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  // Get upload status info
  const getUploadStatusInfo = useCallback(() => {
    switch (uploadStatus) {
      case UPLOAD_STATUS.UPLOADING:
        return {
          message: `Uploading... ${uploadProgress}%`,
          type: "info",
          showProgress: true,
        };
      case UPLOAD_STATUS.UPLOADED:
        return {
          message: `✅ Successfully uploaded ${uploadedFiles.length} file(s)`,
          type: "success",
          showProgress: false,
        };
      case UPLOAD_STATUS.ERROR:
        return {
          message: `❌ Upload failed: ${uploadError}`,
          type: "error",
          showProgress: false,
        };
      default:
        return {
          message: "",
          type: "idle",
          showProgress: false,
        };
    }
  }, [uploadStatus, uploadProgress, uploadedFiles.length, uploadError]);

  // Format file info for display
  const formatFileInfo = useCallback((file) => {
    return {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    };
  }, []);

  const value = {
    // State
    uploadStatus,
    uploadError,
    uploadedFiles,
    uploadProgress,

    // Actions
    onUploadDocument,
    clearUploadState,
    removeUploadedFile,
    validateFiles,

    // Utilities
    getUploadStatusInfo,
    formatFileInfo,

    // Configuration
    maxFileSize: UI_CONFIG.MAX_FILE_SIZE,
    supportedTypes: UI_CONFIG.SUPPORTED_FILE_TYPES,
    statusTypes: UPLOAD_STATUS,

    // Constants
    ERROR_MESSAGES,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

UploadProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UploadContext };
