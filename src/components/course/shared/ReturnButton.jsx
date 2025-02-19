import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ReturnButton = ({
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
      startIcon={<ArrowBackIcon />}
      sx={{
        "&:hover": {
          backgroundColor: "secondary",
        },
        marginTop: "16px",
        marginBottom: "16px",
        ...sx,
      }}
    >
      {text}
    </Button>
  );
};

export default ReturnButton;
