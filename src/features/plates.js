import { createSlice } from "@reduxjs/toolkit";
import foodService from "../services/foodService";

const initialState = {
  loading: false,
  error: false,
  data: []
}

const platesSlice = createSlice({
  name: 'plates',
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

export function fetchPlates() {
  return async (dispatch) => {
    dispatch(setLoading())
    foodService.getAll()
    .then((response) => {
      dispatch(setItems(response.data));
    })
    .catch((er) => {
      dispatch(setError());
    });
  }
}

export const { addItem, updateItem, removeItem, setLoading, setItems, setError } = platesSlice.actions

export default platesSlice.reducer