// src/config.js

const isProd = import.meta.env.PROD;

// Replace with your actual Render URL (WITHOUT trailing slash)
const PRODUCTION_URL = "https://curenza-api.onrender.com";
const LOCAL_URL = "http://localhost:8080";

export const BASE_URL = isProd ? PRODUCTION_URL : LOCAL_URL;
export const API_BASE_URL = `${BASE_URL}/api`;
export const WS_URL = `${BASE_URL}/ws`;