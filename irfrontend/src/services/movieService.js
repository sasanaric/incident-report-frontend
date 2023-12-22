import { createInstance } from "./baseService";

const authInstance = createInstance(true);
const guestInstance = createInstance(false);

export const getAllMovies = () => {
  return guestInstance.get("/imdb/movies/");
};

export const getAllGenres = () => {
  return guestInstance.get("/imdb/genres/");
};

export const postMovie = (movie) => {
  return authInstance.post("/imdb/movies/", movie);
};

const movieService = {
  getAllGenres,
  getAllMovies,
  postMovie,
};

export default movieService;
