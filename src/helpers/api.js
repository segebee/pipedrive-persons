import Axios from "axios";
import { API_URL } from "./constants";
import { TOKEN } from "./constants";

export const getAllPersons = async (start, limit) => {
  try {
    const response = await Axios.get(
      `${API_URL}/persons?start=${start}&limit=${limit}&api_token=${TOKEN}&get_summary=1`
    );
    return response.data;
  } catch (err) {
    // console.log(err);
    return { err };
  }
};

export const getAllPersonFields = async () => {
  try {
    const response = await Axios.get(
      `${API_URL}/personFields?api_token=${TOKEN}`
    );
    return response.data.data;
  } catch (err) {
    // console.log(err);
    return { err };
  }
};

export const createPerson = async data => {
  try {
    const response = await Axios.post(
      `${API_URL}/persons?api_token=${TOKEN}`,
      data
    );
    // console.log("create person response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const getPerson = async id => {
  try {
    const response = await Axios.get(
      `${API_URL}/persons/${id}?api_token=${TOKEN}`
    );
    // console.log("get person response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const findPersons = async name => {
  try {
    const response = await Axios.get(
      `${API_URL}/persons/find?term=${name}&api_token=${TOKEN}`
    );
    // console.log("find person response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const storePersonOrder = async (id, data) => {
  try {
    const response = await Axios.put(
      `${API_URL}/persons/${id}?api_token=${TOKEN}`,
      data
    );
    // console.log("store person order response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const deletePerson = async id => {
  try {
    const response = await Axios.delete(
      `${API_URL}/persons/${id}?api_token=${TOKEN}`
    );
    // console.log("delete person response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const createOrganization = async data => {
  try {
    const response = await Axios.post(
      `${API_URL}/organizations?api_token=${TOKEN}`,
      data
    );
    // console.log("create organization response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const getOrganizations = async name => {
  try {
    const response = await Axios.get(
      `${API_URL}/organizations/find?term=${name}&api_token=${TOKEN}`
    );
    // console.log("get organization response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const getAllOrganizations = async () => {
  try {
    const response = await Axios.get(
      `${API_URL}/organizations?api_token=${TOKEN}`
    );
    // console.log("get all organizations response", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
};
