import axios from "../utils/axiosInstance";

export const loginUser = async (credentials) => {
  const res = await axios.post("/login", credentials);
  return res.data; // { user, token }
};
