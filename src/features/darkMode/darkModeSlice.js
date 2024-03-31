import { createSlice } from "@reduxjs/toolkit";


const darkModeSlice = createSlice({
    name : 'darkMode',
    initialState: {
        darkMode: false
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
    }
})

export const {toggleDarkMode} = darkModeSlice.actions;
export default darkModeSlice.reducer;