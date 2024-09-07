// src/components/EditSeason.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:2022';

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

const EditSeason = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const response = await axios.get(`/season/${id}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const season = response.data.data;
        setName(season.name);
        setDescription(season.description);
        setStatus(season.status);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch season.');
      }
    };

    fetchSeason();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/season/${id}`, { name, description, status }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      navigate('/season'); // Redirect to the season list page
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update season.');
    }
  };

  return (
    <div className="edit-season-container">
      <h1>Edit Season</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Update Season</button>
      </form>
    </div>
  );
};

export default EditSeason;
