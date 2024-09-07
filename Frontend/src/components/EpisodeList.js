import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateGenres, deleteGenre } from '../redux/genreSlice';
import { Link } from 'react-router-dom';
import './EpisodeList.css'; 

axios.defaults.baseURL = 'http://localhost:2022';

const getToken = () => localStorage.getItem('token');

const EpisodeList = ({ heading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const Episode = useSelector((state) => state.episode || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(`/episode/getall`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          params: {
            page: currentPage, 
          },
        });

        console.log(response.data); 

        const { episode: fetchedEpisode, totalPages: fetchedTotalPages, token } = response.data;

        if (token) {
          localStorage.setItem('token', token);
        }

        dispatch(updateEpisode({ episode: fetchedEpisode, totalPages: fetchedTotalPages }));
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        console.error("Error fetching episode:", error.response?.data || error);
        alert(error.response?.data?.error || 'Sign in again.');
      }
    };

    fetchEpisode();
  }, [currentPage, dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/episode/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      dispatch(deleteEpisode(id)); // Ensure action creator matches the argument type
      // Consider using a notification library for user feedback
      console.log('Episode deleted successfully');
    } catch (error) {
      console.error("Failed to delete genre:", error.response?.data || error);
      // Use a more user-friendly notification here
      alert(error.response?.data?.error || 'Failed to delete episode.');
    }
  };
  

  return (
    <div className="episode-list-container">
      <h1>{heading || "Episode List View"}</h1>
      <div className="tab-container">
        <Link to="/genres" className="tab-link ">Genre</Link>
        <Link to="/series" className="tab-link">Series</Link>
        <Link to="/season" className="tab-link">Season</Link>
        <Link to="/episode" className="tab-link active">Episode</Link>
      </div>
      <div className="top-actions">
        <Link to="/episode/add" className="add-episode-button">Add Episode</Link>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Parent</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Episode.map((episode) => (
              <tr key={episode.id}>
                <td>{episode.name}</td>
                <td>{episode.description}</td>
                <td>{episode.parent || '-'}</td>
                <td>
                  <div 
                    style={{ 
                      width: '30px', 
                      height: '30px', 
                      backgroundColor: episode.color || '#fff' 
                    }}></div>
                </td>
                <td>{episode.status || 'Active'}</td>
                <td>
                  <Link to={`/episode/${episode.name}/edit`}>Edit</Link> |
                  <Link to={`/episode/${episode.name}/view`}>View</Link> |
                  <button onClick={() => handleDelete(episode.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 4}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <select
            value={5} 
            onChange={(e) => {
              
            }}
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EpisodeList;
