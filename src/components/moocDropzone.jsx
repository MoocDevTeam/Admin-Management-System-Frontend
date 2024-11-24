import { Avatar } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function MoocDropzone(props) {
  const [avatarSrc, setAvatarSrc] = useState(null);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarSrc(event.target.result);
      
      console.log('event.target.result',event.target.result);
      if (props.avatarResult) {
        props.avatarResult(event.target.result);
      }
    };

    reader.readAsDataURL(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <Avatar src={avatarSrc} sx={{ width: 100, height: 100 }}></Avatar>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}
