import axios from "axios";

/**
 * Uploads a file to the server without tracking progress via axios.
 * Progress will be tracked using SignalR.
 *
 * @param {File} file - The file to upload.
 * @param {string} folderName - The folder where the file will be uploaded.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const uploadFile = async (file, folderName, url) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", folderName);

    // Simplified upload without onUploadProgress
    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return response.data.fileUrl;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};
