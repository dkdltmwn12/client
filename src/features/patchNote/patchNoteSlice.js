import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPatchNote } from "../../api/getData";



export const getPatchNoteFromDB = createAsyncThunk(
    'patchNote/get',
    () => getPatchNote()
)

export const patchNoteSlice = createSlice({
    name : 'patchNote',
    initialState: {
        getPatchNotes: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPatchNoteFromDB.fulfilled, (state, action) => {
            state.getPatchNotes = action.payload;
        })
    }
})

export default patchNoteSlice.reducer