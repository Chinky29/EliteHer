// This file contains the API client and functions to communicate with the Flask backend.
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

// Hardcoded for beginner simplicity as per instructions
const USER_ID = 'demo_user';

export const logCycle = async (data) => {
  return await API.post('/log-cycle', { ...data, user_id: USER_ID });
};

export const getCycles = async () => {
  return await API.get(`/cycles/${USER_ID}`);
};

export const predictRisk = async (data) => {
  return await API.post('/predict', data);
};

export const getInsights = async () => {
  return await API.get(`/insights/${USER_ID}`);
};
