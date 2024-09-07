import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/Signup';
import SignIn from './components/Signin';
import GenreList from './components/GenreList';
import AddGenre from './components/AddGenre';
import EditGenre from './components/EditGenre';
import SeriesList from './components/SeriesList';
import AddSeries from './components/AddSeries';
import EditSeries from './components/EditSeries';
import SeasonList from './components/SeasonList';
import AddSeason from './components/AddSeason';
import EditSeason from './components/EditSeason';
import EpisodeList from './components/EpisodeList';
import AddEpisode from './components/AddEpisode';
import EditEpisode from './components/EditEpisode';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        
          <Route
            path="/"
            element={<SignUp heading="Sign Up for an Account" />}
          />
            <Route
            path="/signin"
            element={<SignIn heading="Sign In to Your Account" />}
          />
           <Route
            path="/genres"
            element={<GenreList heading="Genre List" />}
          />
          <Route
            path="/genres/add"
            element={<AddGenre heading="Add New Genre" />}
          />
          <Route
            path="/genres/:id/edit"
            element={<EditGenre heading="Edit Genre" />}
          />
          <Route
          path="/series"
          element={<SeriesList heading="Series List" />}
          />
          <Route
          path="/series/add"
          element={<AddSeries heading="Add New Series" />}
          />
          <Route
            path="/series/:id/edit"
            element={<EditSeries heading="Edit Series" />}
          />
          <Route
            path="/season"
            element={<SeasonList heading="Season List" />}
          />
          <Route
            path="/season/add"
            element={<AddSeason heading="Add New Season" />}
          />
          <Route
            path="/season/:id/edit"
            element={<EditSeason heading="Edit Season" />}
          />
          <Route
            path="/episode"
            element={<EpisodeList heading="Episode List" />}
          />
          <Route
            path="/episode/add"
            element={<AddEpisode heading="Add New Episode" />}
          />
          <Route
            path="/episode/:id/edit"
            element={<EditEpisode heading="Edit Episode" />}
          />
          
  </Routes>
      </div>
    </Router>
  );
}

export default App;
