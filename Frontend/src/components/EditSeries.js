// src/components/EditSeries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:2022';

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

const EditSeries = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(`/series/${id}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const series = response.data.data;
        setName(series.name);
        setDescription(series.description);
        setStatus(series.status);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch series.');
      }
    };

    fetchSeries();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/series/${id}`, { name, description, status }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      navigate('/series'); // Redirect to the series list page
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update series.');
    }
  };

  return (
    <div className="edit-series-container">
      <h1>Edit Series</h1>
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
        <button type="submit">Update Series</button>
      </form>
    </div>
  );
};

export default EditSeries;
