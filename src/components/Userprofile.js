import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    full_name: '',
    phone_number: '',
    address: '',
  });

  const token = localStorage.getItem('jwtToken');

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        setUpdatedProfile(response.data);  // Initialize editable fields
      } catch (error) {
        setError('Error fetching profile data');
      }
    };

    fetchProfileData();
  }, [token]);

  // Handle profile updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:8000/api/profile/', updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(updatedProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {profileData.full_name}</p>
          <p><strong>Phone Number:</strong> {profileData.phone_number}</p>
          <p><strong>Address:</strong> {profileData.address}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            value={updatedProfile.full_name}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="phone_number"
            value={updatedProfile.phone_number}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
          />
          <textarea
            name="address"
            value={updatedProfile.address}
            onChange={handleInputChange}
            placeholder="Address"
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
