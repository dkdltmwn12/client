import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCommentList } from "../../api/getData";


export const getCommentListFromDB = createAsyncThunk(
    'comment/get',
    () => getCommentList()
)

export const commentSlice = createSlice({
    name : 'comment',
    initialState: {
        getCommentList: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCommentListFromDB.fulfilled, (state, action) => {
            state.getCommentList = action.payload;
        })
    }
});

export default commentSlice.reducer;