import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus(null);
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadStatus(`❌ ${data.message || "Upload failed"}`);
      } else {
        setUploadStatus(`✅ File uploaded: ${data.filename}`);
      }
    } catch (err) {
      setUploadStatus("❌ Server error during upload");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload File</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "2rem",
          textAlign: "center",
          background: isDragActive ? "#f0f0f0" : "#fff",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here ...</p> : <p>Drag & drop a file here, or click to select</p>}
      </div>
      {uploadStatus && (
        <p style={{ marginTop: "1rem", color: uploadStatus.startsWith("✅") ? "green" : "red" }}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
