import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { participantsInfo } from "../../api/postData";


export const fetchingParticipants = createAsyncThunk(
    'participants/get',
    async(IdList) => await participantsInfo(IdList)

    
)

export const participantsSlice = createSlice({
    name: 'participants',
    initialState: {
        loading: false,
        getParticipants: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchingParticipants.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchingParticipants.fulfilled, (state, action) => {
            state.loading = false;
            state.getParticipants = action.payload;
        })
        .addCase(fetchingParticipants.rejected, (state, action) => {
            state.getParticipants = []
        })
    }
})

export default participantsSlice.reducer