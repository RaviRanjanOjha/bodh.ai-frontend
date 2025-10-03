import { useRef, useState, useContext } from "react";
import { Context } from "../../context/Context";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import Modal from "../modal/Modal";
import "./fileUpload.css";

const FileUpload = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { onUploadDocument, isUploadModalOpen, handleCloseUploadModal } = useContext(Context);

  const processNewFiles = (files) => {
    console.log("Step 1: Processing new files from user input.", files);

    const validFiles = Array.from(files).filter((file) => {
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        return true;
      } else {
        alert(`File Type not supported: ${file.name}`);
        return false;
      }
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    console.log("Step 2: Files added to component state. Total files:", [
      ...selectedFiles,
      ...validFiles,
    ]);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    processNewFiles(files);

    // if (fileInputRef.current) {
    //     fileInputRef.current.value = '';
    // }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    processNewFiles(files);
  };

  const handleDeselect = (indexToRemove) => {
    console.log(`Step 3: Deselecting file at index ${indexToRemove}`);
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleFinalUpload = () => {
    console.log(
      "Step 4: Upload button clicked. Initiating upload for all files:",
      selectedFiles
    );

    selectedFiles.forEach((file) => {
      console.log(
        `Sending file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`
      );
    });
    if (selectedFiles.length > 0) {
      onUploadDocument(selectedFiles);
      handleCloseUploadModal();
    } else {
      alert("Please select at least one file to upload.");
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Modal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal}>
      <div className="file-upload-container">
        <button className="close-button" onClick={handleCloseUploadModal}>
          <FaTimes />
        </button>
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <MdOutlineUploadFile size={48} color="#909090" />
          <p>Drag and drop files here</p>
          <button onClick={handleUploadButtonClick}>Browse Files</button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf, .xls, .xlsx"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="file-cards-container">
            <p className="selected-files-title">
              Selected Documents ({selectedFiles.length})
            </p>
            <div className="file-cards-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-card">
                  <div className="file-info">
                    <div className="file-icon">📁</div>
                    <span>{file.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeselect(index)}
                    className="deselect-icon"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button className="upload-all-button" onClick={handleFinalUpload}>
              Upload All Files
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileUpload;
