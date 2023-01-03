import http from './http-commons';
import authHeader from './authHeader';
import { API_URL } from './config';
import axios from 'axios';

class MainService {

  getModules() {
    return http.get(API_URL + 'modules/', { headers: authHeader() });
  }

  createRestaurant = data => {
    return http.post(API_URL + "restaurant/", data, { headers: { 'Authorization' : 'Token 314f92b534a3b008ae47d9fc6db3bf7255c382fd'} });
    // return http.post(API_URL + "restaurant/", data, { headers: authHeader() });
  };

  activateAccount = data => {
    return http.post(API_URL + "reset-account", data, { headers: { 'Content-Type' : 'application/json' } });
  };

  createClient = data => {
    return http.post(API_URL + "client/", data, { headers: { 'Content-Type' : 'application/json' } });
  };
  
  getModule = id => {
    return http.get(`drink/${id}/`, { headers: authHeader() });
  };
  
}

export default new MainService();
