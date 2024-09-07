import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateSeries, deleteSeries } from '../redux/seriesSlice';
import { Link } from 'react-router-dom';
import './SeriesList.css'; 

axios.defaults.baseURL = 'http://localhost:2022';

const getToken = () => localStorage.getItem('token');

const SeriesList = ({ heading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const Series = useSelector((state) => state.series || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get('/series/getall', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          params: {
            page: currentPage, 
          },
        });

        console.log(response.data); 

        const { series: fetchedSeries, totalPages: fetchedTotalPages, token } = response.data;

        if (token) {
          localStorage.setItem('token', token);
        }

        dispatch(updateSeries({ series: fetchedSeries, totalPages: fetchedTotalPages }));
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        console.error("Error fetching series:", error.response?.data || error);
        alert(error.response?.data?.error || 'Sign in again.');
      }
    };

    fetchSeries();
  }, [currentPage, dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/series/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      dispatch(deleteSeries(id)); // Ensure action creator matches the argument type
      // Consider using a notification library for user feedback
      console.log('Series deleted successfully');
    } catch (error) {
      console.error("Failed to delete series:", error.response?.data || error);
      // Use a more user-friendly notification here
      alert(error.response?.data?.error || 'Failed to delete series.');
    }
  };
  

  return (
    <div className="series-list-container">
      <h1>{heading || "Series List View"}</h1>
      <div className="tab-container">
        <Link to="/genres" className="tab-link">Genre</Link>
        <Link to="/series" className="tab-link active">Series</Link>
        <Link to="/season" className="tab-link">Season</Link>
        <Link to="/episode" className="tab-link">Episode</Link>
      </div>
      <div className="top-actions">
        <Link to="/series/add" className="add-series-button">Add Series</Link>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Source</th>
              <th>Color</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Series.map((series) => (
              <tr key={series.id}>
                <td>{series.name}</td>
                <td>{series.description}</td>
                <td>{series.parent || '-'}</td>
                <td>
                  <div 
                    style={{ 
                      width: '30px', 
                      height: '30px', 
                      backgroundColor: series.color || '#fff' 
                    }}></div>
                </td>
                <td>{series.status || 'Active'}</td>
                <td>
                  <Link to={`/series/${series.name}/edit`}>Edit</Link> |
                  <Link to={`/series/${series.name}/view`}>View</Link> |
                  <button onClick={() => handleDelete(series.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 2}
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

export default SeriesList;
