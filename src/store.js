import { configureStore } from "@reduxjs/toolkit";
import ThemeOptions from "./reducers/ThemeOptions";
import authReducer from './features/auth'
import platesReducer from "./features/plates"
import drinksReducer from "./features/drinks"
import menuReducer from "./features/menu"

export default configureStore({
  reducer: {
    ThemeOptions,
    auth: authReducer,
    plates: platesReducer,
    drinks: drinksReducer,
    menu: menuReducer
  }
})
