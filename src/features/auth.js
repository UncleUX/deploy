import { createSlice } from "@reduxjs/toolkit";
import AuthService from "../services/AuthService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    get: (state) => {
      return state.data
    },
    loggedIn: (draft, action) => {
      draft.isLoggedIn = true
      draft.user = action.payload
      
      return
    },
  }
})

export function login(username, password) {
  return AuthService.login(username, password).then((response) => {
    actions.loggedIn(response)
  })
}

export function logout(username, password) {
  return AuthService.logout()
}

export function reset(username) {
  return AuthService.reset(username)
}

export function resetPassword(token, password, confirm) {
  return AuthService.resetPassword(token, password, confirm)
}

const { actions, reducer } = authSlice

export default reducer