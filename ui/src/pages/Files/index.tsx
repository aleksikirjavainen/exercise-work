import { useNavigate } from "react-router-dom";

const FilesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Files</h2>
      <p>Select an action:</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "2rem", justifyContent: "center" }}>
        <button onClick={() => navigate("/files/upload")} style={{ padding: "1rem 2rem" }}>
          Upload File
        </button>
        <button onClick={() => navigate("/files/my-files")} style={{ padding: "1rem 2rem" }}>
          My Files
        </button>
      </div>
    </div>
  );
};

export default FilesPage;
