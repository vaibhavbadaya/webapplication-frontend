import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const fetchDashboardData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/dashboard/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDashboardData(response.data);
        } catch (error) {
          setError(`Error fetching dashboard data: ${error.message}`);
          console.error("Error fetching dashboard data:", error);
        }
      };
      

    fetchDashboardData();
  }, [token]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  
  if (!token) {
    return <Navigate to="/" />;
  }
  
  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Total Files Uploaded: {dashboardData.total_files}</h3>
        <h4>File Types Breakdown:</h4>
        <ul>
          {Object.entries(dashboardData.file_types_breakdown).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
        <h4>Files Uploaded by Each User:</h4>
        <ul>
          {Object.entries(dashboardData.user_file_count).map(([username, count]) => (
            <li key={username}>{username}: {count} files</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
