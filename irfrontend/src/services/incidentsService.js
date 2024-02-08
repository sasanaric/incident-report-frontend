import { createInstance } from "./baseService";
import { INCIDENT_URL, TRANSLATE_URL } from "../constants/URL";
const authInstance = createInstance(INCIDENT_URL, true);
const guestInstance = createInstance(INCIDENT_URL, false);
const translateInstance = createInstance(TRANSLATE_URL, false);

export const getAllIncidents = () => {
  return guestInstance.get(`/incidents/`);
};

export const postIncident = (request) => {
  return guestInstance.post(`/incidents/`, request);
};
export const approveIncident = (request) => {
  return authInstance.post(`/api/approve/`, request);
};

export const deleteIncident = (id) => {
  return authInstance.delete(`/api/delete/${id}/`);
};

export const filterIncidents = (request) => {
  return guestInstance.post(`/incidents/filter/`, request);
};

export const translateText = (request) => {
  return translateInstance.post(`/translate/en-sr/`, request);
};
export const nlpIncidents = () => {
  return authInstance.get(`/incidents/nlp/`);
};
export const analysisTypeIncidents = () => {
  return guestInstance.get(`/incidents/analysis/types/`);
};
export const analysisMonthsIncidents = () => {
  return guestInstance.get(`/incidents/analysis/months/`);
};
export const analysisDaysIncidents = () => {
  return guestInstance.get(`/incidents/analysis/days/`);
};
export const getApprovedIncidents = () => {
  return guestInstance.get(`/incidents/approved/`);
};

export const getNotApprovedIncidents = () => {
  return guestInstance.get(`/incidents/not-approved`);
};

export const getAllTypes = () => {
  return guestInstance.get("/types/");
};
export const getParentTypes = () => {
  return guestInstance.get("/types/parent/");
};
export const getSubTypes = () => {
  return guestInstance.get("/types/sub/");
};

const incidentsService = {
  getAllIncidents,
  postIncident,
  getApprovedIncidents,
  getNotApprovedIncidents,
  getAllTypes,
  getSubTypes,
  getParentTypes,
  filterIncidents,
  approveIncident,
  translateText,
  deleteIncident,
  nlpIncidents,
  analysisTypeIncidents,
  analysisMonthsIncidents,
  analysisDaysIncidents,
};

export default incidentsService;
