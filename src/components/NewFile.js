import React, { useState } from "react";
import axios from "axios";

const NewFile = ({ onFileUpload }) => {  // Accept callback to refresh file list
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");  // Store success/error messages

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");  // Reset message when selecting a new file
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first!");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setMessage("⚠️ No authentication token found. Please log in first.");
      return;
    }

    setIsUploading(true);
    setMessage("");  // Reset previous messages

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:8000/api/files/", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      setMessage("✅ File uploaded successfully!");
      setFile(null);  // Clear file selection

      if (onFileUpload) {
        onFileUpload();  // Refresh file list if callback is provided
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(error.response?.data?.error || "❌ Upload failed! Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading || !file}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>} {/* Show success/error messages */}
    </div>
  );
};

export default NewFile;
