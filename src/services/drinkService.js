import http from './http-commons';
import authHeader from './authHeader';
import { API_URL } from './config';
import axios from 'axios';

class DrinkService {

  getDrinkType() {
    return http.get(API_URL + 'admin/drink/type/', { headers: authHeader() });
  }
  
  getDrinkCategory() {
    return http.get(API_URL + 'admin/drink/category/', { headers: authHeader() });
  }

  getAll() {
    return http.get(API_URL + 'drink/', { headers: authHeader() });
  }

  getAdmin() {
    return http.get(API_URL + 'admin/drink/', { headers: authHeader() });
  }

  getAdminID = id => {
    return http.get(`admin/drink/${id}/`, { headers: authHeader() });
  };
  
  get = id => {
    return http.get(`drink/${id}/`, { headers: authHeader() });
  };

  getDrinkByType = (type, name) => {
    return http.get(`drink/?type=${type}&name=${name}`, { headers: authHeader() });
  };

  getDrinkByName = name => {
    return http.get(`drink/?name=${name}`, { headers: authHeader() });
  };
  
  create = data => {
    const user = JSON.parse(localStorage.getItem('user'));
    let authHeader = {}
    if (user && user.token) {
      authHeader = { 'Authorization': 'Token ' + user.token, "Content-type": "multipart/form-data" };
    } else {
      authHeader = {};
    }
    return axios.post(API_URL + "drink/", data, { headers: authHeader })
  };
  
  update = (id, data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    let authHeader = {}
    if (user && user.token) {
      authHeader = { 'Authorization': 'Token ' + user.token, "Content-type": "multipart/form-data" };
    } else {
      authHeader = {};
    }
    return axios.put(API_URL + `drink/${id}/`, data, { headers: authHeader })
    // return http.put(`drink/${id}`, data, { headers: authHeader() });
  };
  
  remove = id => {
    return http.delete(`drink/${id}/`, { headers: authHeader() });
  };
  
}

export default new DrinkService();
