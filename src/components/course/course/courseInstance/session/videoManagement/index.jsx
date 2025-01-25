import React from 'react'
import { List, ListItemButton, ListItemText, ListItemIcon, Divider, Box, Typography } from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FileUploadPanel from './FileUploadPanel';
import { useTheme } from "@mui/material/styles";
import Link from '@mui/material/Link';


function VideoManagement({ session, onClose, title }) {
  const theme = useTheme();

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
          <List key={index} sx={{ paddingLeft: "10px" }}>
            <ListItemButton
              component={Link}
              href={item.filePath || "#"} // 链接地址
              target="_blank" // 新窗口打开
              underline="none" // 去掉下划线
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={item.fileName || "Untitled File"}
              />
            </ListItemButton>
            <Divider />
          </List>
        )
      })}
      <FileUploadPanel />
    </Box>
  );
}

export default VideoManagement