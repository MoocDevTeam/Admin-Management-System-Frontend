import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const BackButton = ({
  variant = "contained",
  color = "secondary", 
  text = "Back",
  sx, 
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
        "&:hover": {
          backgroundColor: "secondary", 
        },
        ...sx, 
      }}
    >
      {text}
    </Button>
  );
};

export default BackButton;
