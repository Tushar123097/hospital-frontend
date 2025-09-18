// // src/config.js
// const API_BASE_URL = "https://hospital-backend-pb16.onrender.com/api";

// export default API_BASE_URL;
// src/config.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default API_BASE_URL;
