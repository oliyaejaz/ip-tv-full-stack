// src/components/EditEpisode.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:2022';

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

const EditEpisode = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(`/episode/${id}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const episode = response.data.data;
        setName(episode.name);
        setDescription(episode.description);
        setStatus(episode.status);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch episode.');
      }
    };

    fetchEpisode();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/episode/${id}`, { name, description, status }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      navigate('/episode'); // Redirect to the episode list page
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update episode.');
    }
  };

  return (
    <div className="edit-episode-container">
      <h1>Edit Episode</h1>
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
        <button type="submit">Update Episode</button>
      </form>
    </div>
  );
};

export default EditEpisode;
