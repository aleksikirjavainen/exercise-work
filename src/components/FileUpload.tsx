import { useState } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Only PNG, JPEG, and PDF are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="container">
      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p>Drag & drop a file here</p>
        <p>or</p>
        <input
          type="file"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="file-label">
          Select a file
        </label>
      </div>

      {file && (
        <div className="file-info">
          <p><strong>Selected File:</strong></p>
          <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
        </div>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
