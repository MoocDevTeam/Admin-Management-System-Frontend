import React, { useState } from "react";
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
import FileUploadPanel from "./FileUploadPanel";
import EditModal from "./EditModal";

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
      {session?.media?.map((item, index) => {
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
    </Box>
  );
}

export default function SessionStack({ sessions, sx = {} }) {
  const [openVideoPanelIndex, setOpenVideoPanelIndex] = useState(null);
  const [openEditPanelIndex, setOpenEditPanelIndex] = useState(null);

  const handleVideoPanelOpen = (index) => {
    setOpenVideoPanelIndex(index);
  };

  const handleEditPanelOpen = (index) => {
    setOpenEditPanelIndex(index);
  };

  const handleCloseVideoPanel = () => {
    setOpenVideoPanelIndex(null);
  };

  const handleCloseEditPanel = () => {  
    setOpenEditPanelIndex(null);
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Stack spacing={2}>
        {sessions.map((session, index) => (
          <div key={index}>
            <Item
              onClick={openVideoPanelIndex === index ? () => handleCloseVideoPanel() : () => handleVideoPanelOpen(index)}
              sx={{
                fontSize: "16px",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{session.title}</span>
              <Button
                variant="contained"
                color="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleEditPanelOpen(index);
                }}
              >
                Edit
              </Button>
            </Item>

            {openVideoPanelIndex === index && (
              <UploadVideoPanel
                session={session}
                onClose={handleCloseVideoPanel}
                title={session.title}
              />
            )}

            {openEditPanelIndex === index && (
              <EditModal
                onClose={handleCloseEditPanel}
                session={session}
              />
            )}

          </div>
        ))}
      </Stack>
    </Box>
  );
}
