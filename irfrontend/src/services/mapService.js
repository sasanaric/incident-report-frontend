import { createInstance } from "./baseService";
import { MAP_URL } from "../constants/URL";
// const authInstance = createInstance(MAP_URL,true);
const guestInstance = createInstance(MAP_URL, false);

export const getAllLocations = () => {
  return guestInstance.get(`/locations/`);
};

const mapService = {
  getAllLocations,
};

export default mapService;
