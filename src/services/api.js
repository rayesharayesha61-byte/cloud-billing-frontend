// // import axios from "axios";

// // const API = axios.create({
// //   baseURL:
// //     process.env.REACT_APP_API_URL ||
// //     "http://localhost:5000/api",

// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // API.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem("token");

// //     if (token) {
// //       config.headers.Authorization =
// //         `Bearer ${token}`;
// //     }

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // export default API;
// import axios from "axios";

// const API = axios.create({
//   baseURL:
//     process.env.REACT_APP_API_URL ||
//     "http://localhost:5000/api",
// });

// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default API;
import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    // "http://localhost:5000/api",
    "https://cloud-billing-backend.onrender.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;


