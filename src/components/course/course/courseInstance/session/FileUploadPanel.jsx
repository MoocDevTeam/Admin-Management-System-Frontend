import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { uploadFile } from "../../../../../request/uploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import * as signalR from "@microsoft/signalr";

export default function FileUploadPanel({ courseId, courseInstanceId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [connection, setConnection] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  let baseUrl = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/fileUploadHub`, {
        withCredentials: true,
      })
      .build();

    newConnection.on("ReceiveProgressUpdate", (percentage) => {
      setProgress(percentage);
    });

    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR hub");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err.toString()));

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (displayProgress < progress) {
        setDisplayProgress((prev) => Math.min(prev + 1, progress));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [progress, displayProgress]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [progress]);

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

    setLoading(true);

    try {
      const fileUrl = await uploadFile(file, "video", `${baseUrl}/api/FileUpload/UploadFile/upload`, (percent) => {
        setProgress(percent);
      });

      setProgress(100);
      setDisplayProgress(100);
      setTimeout(() => {
        setUploadedUrl(fileUrl);
        toast.success("File uploaded successfully!");
      }, 500);

    } catch (error) {
      toast.error("File upload failed!");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <Box sx={{ marginBottom: "10px" }}>
      {uploadedUrl === "" &&
        <>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} sx={{ marginBottom: "16px" }}>
              Upload File
            </Button>
          </label>

          {file && (
            <Typography variant="body1" sx={{ marginBottom: "16px" }}>
              Selected file: {file.name}
            </Typography>
          )}
        </>
      }

      {loading && (
        <Box sx={{ marginTop: "16px", display: "flex", alignItems: "center" }}>
          <LinearProgress variant="determinate" value={displayProgress} sx={{ flexGrow: 1, marginRight: "8px" }} />
          <Typography variant="body2">{`${Math.round(displayProgress)}%`}</Typography>
        </Box>
      )}

      {uploadedUrl === "" &&
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFileUpload}
            disabled={loading || !file}
          >
            {loading && <CircularProgress size={12} style={{ marginRight: 8 }} />}
            {loading ? "Uploading..." : "Upload Now"}
          </Button>
        </div>
      }

      {uploadedUrl &&
        <Typography variant="body1" sx={{ marginTop: "16px", color: "green" }}>
          File uploaded successfully:
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "8px" }}>
            View File
          </a>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "red", marginLeft: "8px" }}
          >
            Delete
          </a>
        </Typography>
      }
    </Box>
  );
}
