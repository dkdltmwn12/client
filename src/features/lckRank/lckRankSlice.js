import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRanking } from "../../api/getData";


export const fetchingLckRank = createAsyncThunk(
    'lckRanking/get',
    async () => getRanking()
)

export const lckRankSlice = createSlice({
    name : 'lckRanking',
    initialState: {
        getLckRanking: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchingLckRank.fulfilled, (state, action) => {
            state.getLckRanking = action.payload
        })
    }
})

export default lckRankSlice.reducer