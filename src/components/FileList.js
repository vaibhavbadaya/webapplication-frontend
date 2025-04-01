import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiClient } from "./auth";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      setError("You need to log in to view files.");
      return;
    }

    const fetchFiles = async () => {
      try {
        const response = await apiClient.get("/files/");
        setFiles(response.data.files);
      } catch (error) {
        setError("Failed to load files. Please try again.");
      }
    };

    fetchFiles();
  }, [token]);

  if (!token) return <Navigate to="/" replace />;
  return (
    <div>
      <h2>Uploaded Files</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {files.length === 0 ? <p>No files uploaded yet.</p> : (
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Upload Date</th>
              <th>Type</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.filename}>
                <td>{file.filename}</td>
                <td>{new Date(file.upload_date).toLocaleString()}</td>
                <td>{file.content_type}</td>
                <td>
                  <a href={`http://127.0.0.1:8000/api/files/download/${encodeURIComponent(file.filename)}`} download>
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileList;
