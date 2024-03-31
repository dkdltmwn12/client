import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMatchInfoList } from "../../api/getData";

export const fetchingMatchInfoList = createAsyncThunk(
    'matchInfoList/get',
    async (list) => getMatchInfoList(list)
)

export const matchInfoListSlice = createSlice({
    name : 'matchInfoList',
    initialState: {
        loading: false,
        matchInfoList: {
            matchList: [],
            filteredMatchList: [],
            recentPlayed3Champion: [],
        }
    },
    reducers: {
        filteringMatchList: (state, action) => {
            state.matchInfoList.filteredMatchList = state.matchInfoList.matchList.filter((match) => match.info.queueId === action.payload)
        },
        allMatchList: (state, action) => {
            state.matchInfoList.filteredMatchList = state.matchInfoList.matchList
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchingMatchInfoList.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchingMatchInfoList.fulfilled, (state, action) => {
            state.loading = false;
            state.matchInfoList.matchList = action.payload
            state.matchInfoList.filteredMatchList = action.payload
        })
    }
})
export const {filteringMatchList, allMatchList} = matchInfoListSlice.actions;
export default matchInfoListSlice.reducer