// src/components/MovieList.js
import React, { useState, useEffect } from "react";
import { Card } from "antd";
import movieService from "../services/movieService";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  useEffect(() => {
    loadGenres();
    loadMovies();
  }, []);

  const loadGenres = () => {
    console.log("loadGenres()");
    movieService.getAllGenres().then((result) => setAllGenres(result.data));
  };
  const loadMovies = () => {
    movieService.getAllMovies().then((result) => setMovies(result.data));
  };

  const getGenreNames = (genreIds) => {
    return genreIds.map((genreId) => {
      const genre = allGenres.find((g) => g.id === genreId);
      return genre ? genre.name : "";
    });
  };

  return (
    <div>
      <h1>*Movies*</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridGap: "16px",
        }}
      >
        {movies.map((movie) => (
          <Card
            title={movie.title}
            bordered={false}
            style={{
              width: 300,
              borderRadius: "15px",
              borderColor: "midnightblue",
              border: "solid 5px",
            }}
            key={movie.id}
            headStyle={{
              borderBottom: "solid 1px",
            }}
          >
            <p>Year: {movie.year}</p>
            <p>Rating: {movie.rating}</p>
            <div>
              {getGenreNames(movie.genres).map((genreName) => (
                <p key={genreName}>{genreName}</p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
