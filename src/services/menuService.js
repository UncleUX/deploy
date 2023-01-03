import http from './http-commons';
import authHeader from './authHeader';
import { API_URL } from './config';

class MenuService {
  getFoodType() {
    return http.get(API_URL + 'admin/food/type/', { headers: authHeader() });
  }
  
  getFoodCategory() {
    return http.get(API_URL + 'admin/food/category/', { headers: authHeader() });
  }

  getIngredients() {
    return http.get(API_URL + 'ingredient/', { headers: authHeader() });
  }

  getAll() {
    return http.get(API_URL + 'menu/', { headers: authHeader() });
  }

  get = id => {
    return http.get(`menu/${id}/`, { headers: authHeader() });
  };
  
  create = data => {
    return http.post("menu/", data, { headers: authHeader() });
  };

  createPeriod = data => {
    return http.post("menu/publication/period/", data, { headers: authHeader() });
  };
  
  update = (id, data) => {
    return http.put(`menu/${id}/`, data, { headers: authHeader() });
  };
  
  remove = id => {
    return http.delete(`menu/${id}/`, { headers: authHeader() });
  };
  
}

export default new MenuService();
