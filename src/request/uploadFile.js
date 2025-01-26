import axios from "axios";

/**
 * Uploads a file to the server without tracking progress via axios.
 * Progress tracking is managed externally, e.g., using SignalR.
 *
 * @param {File} file - The file object to be uploaded.
 * @param {string} folderName - The target folder on the server for the upload.
 * @param {string} url - The server endpoint URL for the file upload.
 * @param {Function} onProgress - A callback function for handling progress updates (not used here).
 * @param {string} uploadId - A unique identifier for the upload session.
 * @returns {Promise<string>} - The URL of the uploaded file returned by the server.
 * @throws {Error} - Throws an error if the upload fails.
 */
export const uploadFile = async (file, folderName, url, sessionId, onProgress, uploadId) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Attach the file to the FormData object
    formData.append("folderName", folderName); // Specify the target folder name
    formData.append("sessionId", sessionId); // Hardcoded session ID (replace if needed)
    formData.append("uploadId", uploadId); // Add a unique upload identifier

    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct headers for file upload
        },
      }
    );

    return response.data.fileUrl; // Return the file URL from the server response
  } catch (error) {
    console.error("File upload error:", error); // Log the error for debugging
    throw error; // Rethrow the error for the caller to handle
  }
};
