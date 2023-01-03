// Fichier regroupant les selectors pour nous faciliter les opérations de selections

export const selectPlates = (state) => state.plates

export const selectDrinks = (state) => state.drinks

export const selectMenu = (state) => state.menu

export const isLoggedIn = (state) => state.auth.isLoggedIn

export const currentUser = (state) => state.auth.user
