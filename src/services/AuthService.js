import axios from "axios";
import { API_URL } from "./config";
class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "login", { phone: username, password: password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  reset(username) {
    return axios.post(API_URL + "forgot-password", { phone: username, env: "user" })
  }

  resetPassword(token, password, confirm) {
      return axios.post(API_URL + "reset-password", { token: token, new_password: password, confirm_password: confirm})
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();