import React from 'react'
import { List, ListItemButton, ListItemText, ListItemIcon, Divider, Box, Typography } from "@mui/material";
import FileUploadPanel from './FileUploadPanel';
import { useTheme } from "@mui/material/styles";
import Link from '@mui/material/Link';


function VideoManagement({ session, onClose, title }) {
  const theme = useTheme();
  console.log("session?.id: ", session?.id)
  return (
    <Box
      sx={{
        padding: "28px 20px 8px",
        marginTop: "-10px",
        zIndex: -1,
        borderRadius: "8px",
        backgroundColor: theme.palette.background.light,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>Videos</Typography>
      {session?.media?.map((item, index) => {
        return (
          <List key={index} sx={{ padding: "10px" }}>
            <ListItemButton
              component={Link}
              href={item.filePath || "#"}
              target="_blank"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <img
                src={`../../../../../../../../assets/video.png`}
                alt="Video Icon"
                style={{ width: 24, height: 24 }}
              />
              <ListItemText sx={{ marginLeft: "10px" }}
                primary={item.fileName || "Untitled File"}
              />
            </ListItemButton>
          </List>
        )
      })}
      <FileUploadPanel sessionId={session?.id} />
    </Box>
  );
}

export default VideoManagement