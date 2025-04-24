import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  to: string;
  label?: string;
};

const BackButton = ({ to, label = "← Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        border: "1px solid #ccc",
        background: "#f4f4f4",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
};

export default BackButton;
