import axios from "axios";

const axiosAuthInstance = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1",
});

export default axiosAuthInstance;
