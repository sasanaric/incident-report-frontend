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
export const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=ecd6f1b64ee036305d4defc872befbf6",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    return result.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

const incidentsService = {
  getAllIncidents,
  postIncident,
  getApprovedIncidents,
  getNotApprovedIncidents,
  getAllTypes,
  getSubTypes,
  getParentTypes,
  uploadImageToImgBB,
  filterIncidents,
  approveIncident,
  translateText,
  deleteIncident,
  nlpIncidents,
};

export default incidentsService;
