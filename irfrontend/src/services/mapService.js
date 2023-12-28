import { createInstance } from "./baseService";
import { MAP_URL } from "../constants/URL";
const authInstance = createInstance(MAP_URL, true);
const guestInstance = createInstance(MAP_URL, false);

export const getAllLocations = () => {
  return guestInstance.get(`/locations/`);
};
export const getClusterLocations = () => {
  return guestInstance.get("/locations/alarms/");
};
export const deleteLocation = (id) => {
  return authInstance.delete(`/locations/${id}/`);
};
const mapService = {
  getAllLocations,
  getClusterLocations,
  deleteLocation,
};

export default mapService;
