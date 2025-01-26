import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { uploadFile } from "../../../../../../request/uploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import * as signalR from "@microsoft/signalr";
import { v4 as uuidv4 } from 'uuid';

export default function FileUploadPanel({ courseId, courseInstanceId, sessionId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [connection, setConnection] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [uploadId, setUploadId] = useState(null);

  const baseUrl = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/fileUploadHub`, { withCredentials: true })
      .build();
  
    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR hub");
  
        newConnection.invoke("JoinGroup", uploadId)
          .then(() => console.log(`Joined group: ${uploadId}`))
          .catch((err) => console.error("Error joining group: ", err));
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));
  
    setConnection(newConnection);
  
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [uploadId]); 
  

  useEffect(() => {
    if (!connection || !uploadId) return;

    const onProgressUpdate = (data) => {
      if (data.uploadId === uploadId) {
        setProgress(data.percentage);
      }
    };

    connection.on("ReceiveProgressUpdate", onProgressUpdate);

    return () => {
      connection.off("ReceiveProgressUpdate", onProgressUpdate);
    };
  }, [connection, uploadId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (displayProgress < progress) {
        setDisplayProgress((prev) => Math.min(prev + 1, progress));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [progress, displayProgress]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
      setUploadedUrl("");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const newUploadId = uuidv4();
    setUploadId(newUploadId);

    setLoading(true);

    try {
      const fileUrl = await uploadFile(file, "video", `${baseUrl}/api/FileUpload/UploadFile/upload`, sessionId, (percent) => {
        setProgress(percent);
      }, newUploadId);

      setProgress(100);
      setDisplayProgress(100);
      setUploadedUrl(fileUrl);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("File upload failed!");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <Box sx={{ marginBottom: "0px" }}>
      <h3>Add New</h3>
      {uploadedUrl === "" && (
        <Box sx={{ display: "flex", paddingLeft: "10px" }}>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} sx={{ marginBottom: "8px" }}>
              Upload File
            </Button>
          </label>

          {file && (
            <Typography variant="body1" sx={{ marginBottom: "8px", lineHeight: "33px", marginLeft: "10px" }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>
      )}

      {loading && (
        <Box sx={{ margin: "0px", display: "flex", alignItems: "center" }}>
          <LinearProgress variant="determinate" value={displayProgress} sx={{ flexGrow: 1, margin: "8px" }} />
          <Typography variant="body2">{`${Math.round(displayProgress)}%`}</Typography>
        </Box>
      )}

      {uploadedUrl === "" && (
        <Box sx={{ paddingLeft: "10px" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFileUpload}
            disabled={loading || !file}
          >
            {loading && <CircularProgress size={12} style={{ marginRight: 8 }} />}
            {loading ? "Uploading..." : "Upload Now"}
          </Button>
        </Box>
      )}

      {uploadedUrl && (
        <Typography variant="body1" sx={{ marginTop: "16px", color: "green" }}>
          File uploaded successfully:
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "8px" }}>
            View File
          </a>
        </Typography>
      )}
    </Box>
  );
}
