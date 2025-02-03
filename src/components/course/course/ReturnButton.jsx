import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const BackButton = ({
  variant = "contained",
  color = "primary", // Use MUI's 'primary' color
  text = "Back",
  sx, // Add sx prop for custom styles
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant={variant}
      color={color}
      onClick={handleGoBack}
      sx={{
        backgroundColor: "#0288d1", // Set the background color
        "&:hover": {
          backgroundColor: "#1976d2", // Slightly darker shade on hover
        },
        ...sx, // Merge any other styles provided through the sx prop
      }}
    >
      {text}
    </Button>
  );
};

export default BackButton;
