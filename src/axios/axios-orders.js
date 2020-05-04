import axios from "axios";

const axiosOrdersInstance = axios.create({
  baseURL: "https://react-my-burger-dd8da.firebaseio.com/",
});

export default axiosOrdersInstance;
