import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSummoner } from "../../api/getData";
import { getSoloRankMatchInfoListForStat, getTeamRankMatchInfoListForStat } from "../../api/postData";


export const fetchingSummoner = createAsyncThunk(
    'summoner/get',
    async(search) =>  await getSummoner(search)
)

export const fetchingRecentSoloRankMatchListForStat = createAsyncThunk(
    'summoner/soloRank/post',
    async(puuid) => await getSoloRankMatchInfoListForStat(puuid)
)

export const fetchingRecentTeamRankMatchListForStat = createAsyncThunk(
    'summoner/teamRank/post',
    async(puuid) => await getTeamRankMatchInfoListForStat(puuid)
)

export const summonerSlice = createSlice({
    name : 'summoner',
    initialState: {
        loading: false,
        matchStatLoading : false,
        getSummoner: {
            summonerInfo: '',
            summonerTierInfo: {
                solo : {
                    stat : '',
                    recentSoloRankMatch : []
                },
                team : {
                    stat : '',
                    recentTeamRankMatch : []
                },
            },
        }
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchingSummoner.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchingSummoner.fulfilled, (state, action) => {
            state.loading = false;
            state.getSummoner.summonerInfo = action.payload.summonerInfo;
            state.getSummoner.summonerTierInfo.solo.stat = action.payload.summonerTierInfo.solo;
            state.getSummoner.summonerTierInfo.team.stat = action.payload.summonerTierInfo.team;
        })
        .addCase(fetchingRecentSoloRankMatchListForStat.pending, (state) => {
            state.matchStatLoading = true;
        })
        .addCase(fetchingRecentSoloRankMatchListForStat.fulfilled, (state, action) => {
            state.matchStatLoading = false;
            state.getSummoner.summonerTierInfo.solo.recentSoloRankMatch = action.payload;
        })
        .addCase(fetchingRecentTeamRankMatchListForStat.fulfilled, (state, action) => {
            state.getSummoner.summonerTierInfo.team.recentTeamRankMatch = action.payload;
        })

    }
})
export default summonerSlice.reducer