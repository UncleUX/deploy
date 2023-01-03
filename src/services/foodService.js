import http from './http-commons';
import authHeader from './authHeader';
import { API_URL } from './config';

class FoodService {
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
    return http.get(API_URL + 'food/', { headers: authHeader() });
  }

  get = id => {
    return http.get(`food/${id}/`, { headers: authHeader() });
  };

  getFoodByType = (type, name) => {
    return http.get(`food/?type=${type}&name=${name}`, { headers: authHeader() });
  };

  getFoodByName = name => {
    return http.get(`food/?name=${name}`, { headers: authHeader() });
  };
  
  create = data => {
    return http.post("food/", data, { headers: authHeader() });
  };
  
  update = (id, data) => {
    return http.put(`food/${id}/`, data, { headers: authHeader() });
  };
  
  remove = id => {
    return http.delete(`food/${id}/`, { headers: authHeader() });
  };
  
}

export default new FoodService();
