import { createSlice } from "@reduxjs/toolkit";
import drinkService from "../services/drinkService";
import defaultFoodDrink from "../assets/utils/images/drink/drink_3.jpg";

const initialState = {
  loading: false,
  error: false,
  data: []
}

const drinksSlice = createSlice({
  name: 'drinks',
  initialState: initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    endLoading: (state) => {
      state.loading = false;
    },
    setItems: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.error = true;
    },
    addItem: (draft, action) => {

      const index = draft.data.findIndex(item => item.id === action.payload.id)

      draft.data.splice(index, 1, {
        id: action.payload.id,
        name: action.payload.name,
        price: action.payload.price,
        drinkPicture: action.payload.im,
        drinkCategory: {
          id : action.payload.category
        },
        drinkType: {
          id : action.payload.type
        },
        admin_drink: {
          id : action.payload.adminid
        },
        description: action.payload.desc
      })

      return
    },
    removeItem: (draft, action) => {console.log(action)
      const index = draft.data.findIndex(item => item.id === action.payload.id)
      draft.data.splice(index, 1)
    }
  }
})

export function fetchDrinks() {
  return async (dispatch) => {
    dispatch(setLoading())
    drinkService.getAll()
      .then((response) => {
        dispatch(setItems(response.data));
      })
      .catch((er) => {
        dispatch(setError());
      });
  };
}

export const { addItem, removeItem, setLoading, setItems, setError, endLoading } = drinksSlice.actions

export default drinksSlice.reducer