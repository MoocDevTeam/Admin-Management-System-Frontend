import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FileUploadPanel from "./FileUploadPanel"

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.main,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[4],
  },
}));

function UploadVideoPanel({ session, onClose, title }) {
  return (
    <Box
      sx={{
        marginTop: 2,
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>Uploaded Videos:</h3>
      {session.media.map((item, index) => {
        return (
          <List key={index}>
            <ListItem>
              <ListItemIcon>
                <FileIcon /> 
              </ListItemIcon>
              <ListItemText
                primary={item.fileName || "Untitled File"} 
                secondary={`Path: ${item.filePath}, Uploaded on: ${item.createdAt || "Unknown"}`} 
              />
            </ListItem>
            <Divider /> 
          </List>
        )
      })}
      <h3>Upload Video for: {title}</h3>
      <FileUploadPanel />
      <Button variant="contained" onClick={onClose}>
        Close Panel
      </Button>
    </Box>
  );
}

export default function BasicStack({ list, sx = {} }) {
  const [openPanelIndex, setOpenPanelIndex] = React.useState(null); 

  const handleClick = (index) => {
    setOpenPanelIndex(index); 
  };

  const handleClosePanel = () => {
    setOpenPanelIndex(null); 
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Stack spacing={2}>
        {list.map((item, index) => (
          <div key={index}>
            <Item
              onClick={() => handleClick(index)}
              sx={{ fontSize: "16px", padding: "10px 20px" }}
            >
              {item.title}
            </Item>
            {openPanelIndex === index && (
              <UploadVideoPanel
                session={item}
                onClose={handleClosePanel}
                title={item.title} 
              />
            )}
          </div>
        ))}
      </Stack>
    </Box>
  );
}
