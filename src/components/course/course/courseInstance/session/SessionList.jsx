import React, { useState } from "react";
import VideoManagement from "./videoManagement";
import { styled } from "@mui/material/styles";
import EditSessionModal from "./models/EditSessionModal";
import AddSessionModal from "./models/AddSessionModal";
import MoreButton from "../../../../shared/MoreButton";
import { Box, Typography, Paper, Stack } from "@mui/material";

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

export default function SessionList({ sessions, courseInstanceId, sx = {} }) {
  const [openVideoPanelIndex, setOpenVideoPanelIndex] = useState(null);
  const [openEditPanelIndex, setOpenEditPanelIndex] = useState(null);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);

  const handleAddSessionOpen = () => setIsAddSessionModalOpen(true);
  const handleAddSessionClose = () => setIsAddSessionModalOpen(false);

  const handleVideoPanelOpen = (index) => {
    setOpenVideoPanelIndex(index);
  };

  const handleCloseVideoPanel = () => {
    setOpenVideoPanelIndex(null);
  };

  const handleCloseEditPanel = () => {
    setOpenEditPanelIndex(null);
  };

  const handleEdit = (index) => {
    console.log(index)
    setOpenEditPanelIndex(index);
  };

  const handleDelete = () => { console.log("clicked!") };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Sessions
        </Typography>
        <MoreButton
          showAdd={true}
          onAdd={handleAddSessionOpen}
        />
        <AddSessionModal
          open={isAddSessionModalOpen}
          onClose={handleAddSessionClose}
          courseInstanceId={courseInstanceId}
        />
      </Box>
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
              <MoreButton
                showEdit={true}
                showDelete={true}
                onEdit={() => handleEdit(index)}
                onDelete={handleDelete}
              />

            </Item>

            {openVideoPanelIndex === index && (
              <>
                <VideoManagement
                  session={session}
                  onClose={handleCloseVideoPanel}
                  title={session.title}
                />
              </>
            )}

            {openEditPanelIndex === index && (
              <EditSessionModal
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
