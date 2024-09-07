import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateSeason, deleteSeason } from '../redux/seasonSlice';
import { Link } from 'react-router-dom';
import './SeasonList.css'; 

axios.defaults.baseURL = 'http://localhost:2022';

const getToken = () => localStorage.getItem('token');

const SeasonList = ({ heading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const Season = useSelector((state) => state.season || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const response = await axios.get('/season/getall', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          params: {
            page: currentPage, 
          },
        });

        console.log(response.data); 

        const { season: fetchedSeason, totalPages: fetchedTotalPages, token } = response.data;

        if (token) {
          localStorage.setItem('token', token);
        }

        dispatch(updateSeason({ series: fetchedSeason, totalPages: fetchedTotalPages }));
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        console.error("Error fetching season:", error.response?.data || error);
        alert(error.response?.data?.error || 'Sign in again.');
      }
    };

    fetchSeason();
  }, [currentPage, dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/season/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      dispatch(deleteSeason(id)); // Ensure action creator matches the argument type
      // Consider using a notification library for user feedback
      console.log('Season deleted successfully');
    } catch (error) {
      console.error("Failed to delete season:", error.response?.data || error);
      // Use a more user-friendly notification here
      alert(error.response?.data?.error || 'Failed to delete season.');
    }
  };
  

  return (
    <div className="season-list-container">
      <h1>{heading || "Season List View"}</h1>
      <div className="tab-container">
        <Link to="/genres" className="tab-link">Genre</Link>
        <Link to="/series" className="tab-link">Series</Link>
        <Link to="/season" className="tab-link active">Season</Link>
        <Link to="/episode" className="tab-link">Episode</Link>
      </div>
      <div className="top-actions">
        <Link to="/season/add" className="add-season-button">Add Season</Link>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Published Date</th>
              <th>Color</th>
              <th>Status</th>
              <th>Catalog</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Season.map((season) => (
              <tr key={season.id}>
                <td>{season.name}</td>
                <td>{season.description}</td>
                <td>{season.parent || '-'}</td>
                <td>
                  <div 
                    style={{ 
                      width: '30px', 
                      height: '30px', 
                      backgroundColor: season.color || '#fff' 
                    }}></div>
                </td>
                <td>{season.status || 'Active'}</td>
                <td>
                  <Link to={`/season/${season.name}/edit`}>Edit</Link> |
                  <Link to={`/series/${season.name}/view`}>View</Link> |
                  <button onClick={() => handleDelete(season.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 3}
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

export default SeasonList;
