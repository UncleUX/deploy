import { createSlice } from "@reduxjs/toolkit";
import foodService from "../services/foodService";
import menuService from "../services/menuService";

const initialState = {
  loading: false,
  error: false,
  data: []
}

const menuSlice = createSlice({
  name: 'menu',
  initialState: initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setItems: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.error = true;
    },
    get: (state) => {
      return state.data
    },
    addItem: (draft, action) => {
      draft.data.push(action.payload)
      return
    },
    updateItem: (draft, action) => {
      const index = draft.data.findIndex(item => item.id === action.payload.id)
      draft.data.splice(index, 1, action.payload)
      return
    },
    removeItem: (draft, action) => {
      const index = draft.data.findIndex(item => item.id === action.payload.id)
      draft.data.splice(index, 1)
    }
  }
})

export function fetchMenu() {
  return async (dispatch) => {
    dispatch(setLoading())
    menuService.getAll()
    .then((response) => {
      dispatch(setItems(response.data));
    })
    .catch((er) => {
      dispatch(setError());
    });
  }
}

export const { addItem, updateItem, removeItem, setLoading, setItems, setError } = menuSlice.actions

export default menuSlice.reducer