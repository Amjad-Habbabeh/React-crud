import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [moviesName, setMovieName] = useState('');
  const [moviesReview, setMovieReview] = useState('');
  const [movieReviewList, setMovieReviewList] = useState([]);
  const [newReviews, setNewReviews] = useState('');
  const [updateClicked, setUpdateClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moviesName, moviesReview }),
    }).catch((error) => console.log(error));

    setMovieReviewList([{ moviesName, moviesReview }, ...movieReviewList]);
  };
  const handleDelete = (movie) => {
    fetch(`http://localhost:3001/api/delete/${movie}`, {
      method: 'DELETE',
    }).finally(() => {
      setUpdateClicked(!updateClicked);
    });
  };

  const handleUpdate = (movie) => {
    console.log(movie, newReviews);
    fetch('http://localhost:3001/api/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moviesName: movie, moviesReview: newReviews }),
    })
      .catch((error) => console.log(error))
      .finally(() => {
        setUpdateClicked(!updateClicked);
        setNewReviews('');
      });
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/get')
      .then((res) => res.json())
      .then((data) => setMovieReviewList(data));
    console.log('refresh');
  }, [updateClicked]);

  return (
    <div className="App">
      <h1>CRUD APPLICATION</h1>
      <div className="form">
        <label>Movie Name:</label>
        <input
          type="text"
          name="movieName"
          onChange={(e) => setMovieName(e.target.value)}
        />
        <label>Review:</label>
        <input
          type="text"
          name="review"
          onChange={(e) => setMovieReview(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        {movieReviewList.length > 0 &&
          movieReviewList.map((movie) => {
            return (
              <div key={uuidv4()}>
                <h1>
                  Movie Name:{movie.moviesName} | Movie Review:
                  {movie.moviesReview}
                </h1>
                <button onClick={() => handleDelete(movie.moviesName)}>
                  delete
                </button>
                <input
                  type="text"
                  value={newReviews}
                  onChange={(e) => setNewReviews(e.target.value)}
                />
                <button onClick={() => handleUpdate(movie.moviesName)}>
                  update
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
