import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack";
import VideoManagement from "./videoManagement";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import EditModal from "./EditModal";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.main,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    boxShadow: theme.shadows[4],
    cursor: "pointer",
    backgroundColor: theme.palette.background.light,
  },
}));

export default function SessionList({ sessions, sx = {} }) {
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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Outline
      </Typography>
      <Stack spacing={2} sx={{ marginTop: "16px" }} >
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
                position: 'relative',
                zIndex: 0,
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
              <>
                <VideoManagement
                  session={session}
                  onClose={handleCloseVideoPanel}
                  title={session.title}
                />
                {openEditPanelIndex === index && (
                  <EditModal
                    onClose={handleCloseEditPanel}
                    session={session}
                  />
                )}
              </>
            )}



          </div>
        ))}
      </Stack>
    </Box>
  );
}
