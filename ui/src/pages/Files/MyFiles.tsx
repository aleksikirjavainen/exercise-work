import { useEffect, useState } from "react";

type FileEntry = {
  filename: string;
  size: number;
  lastModified: string;
  url: string;
};

const MyFiles = () => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch files");

      setFiles(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const deleteFile = async (filename: string) => {
    const token = localStorage.getItem("token");
    const confirm = window.confirm(`Delete ${filename}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/files/${filename}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      fetchFiles(); // Refresh list
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Files</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>File</th>
              <th>Size (KB)</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.filename}>
                <td>{f.filename}</td>
                <td>{(f.size / 1024).toFixed(1)}</td>
                <td>{new Date(f.lastModified).toLocaleString()}</td>
                <td>
                  <a href={`http://localhost:5000${f.url}`} target="_blank" rel="noreferrer">
                    Download
                  </a>{" "}
                  |{" "}
                  <button onClick={() => deleteFile(f.filename)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyFiles;
