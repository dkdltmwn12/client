import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMatchIdList } from "../../api/getData";
import { recentMostChamp } from "../../util/recentMostChamp";


export const fetchingAddMatchList = createAsyncThunk(
    'addedMatchList/get',
    async ({id, puuid, page, type}) =>  getMatchIdList(id, puuid, page, type)
)

export const addedMatchListSlice = createSlice({
    name : 'addedmatchList', 
    initialState: {
        loading: false,
        getAddedMatch: {
            addedMatchList: [],
            addedSoloRankMatchList: [],
            addedTeamRankMatchList: [],
            addedARAMMatchList: [],
            addedQuickMatchList: [],
            filteredAddedMatchList: [],
            addedRecentPlayed3Champion: []
        }
    },
    reducers: {
        resetAddedMatchList: (state) => {
            state.getAddedMatch.filteredAddedMatchList = [];
            state.getAddedMatch.addedMatchList = [];
            state.getAddedMatch.addedSoloRankMatchList = [];
            state.getAddedMatch.addedTeamRankMatchList = [];
            state.getAddedMatch.addedARAMMatchList = [];
            state.getAddedMatch.addedQuickMatchList = [];
            state.getAddedMatch.addedRecentPlayed3Champion = [];
        },
        filteredAddedQueueMatchList: (state, action) => {
            const {type, id} = action.payload;
            if(type === 'ALL') {
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedMatchList.filter((match) => match.info.queueId === type)
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedMatchList
                .filter((match) => match.info.queueId === type)
                .map(match => match.info.participants
                    .filter(participant => participant.summonerName === id))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 420) {
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedSoloRankMatchList.filter((match) => match.info.queueId === type)
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedSoloRankMatchList
                .filter((match) => match.info.queueId === type)
                .map(match => match.info.participants
                    .filter(participant => participant.summonerName === id))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 440) {
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedTeamRankMatchList.filter((match) => match.info.queueId === type)
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedTeamRankMatchList
                .filter((match) => match.info.queueId === type)
                .map(match => match.info.participants
                    .filter(participant => participant.summonerName === id))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 450) {
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedARAMMatchList.filter((match) => match.info.queueId === type)
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedARAMMatchList
                .filter((match) => match.info.queueId === type)
                .map(match => match.info.participants
                    .filter(participant => participant.summonerName === id))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 490) {
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedQuickMatchList.filter((match) => match.info.queueId === type)
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedQuickMatchList
                .filter((match) => match.info.queueId === type)
                .map(match => match.info.participants
                    .filter(participant => participant.summonerName === id))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            
        },
        allAddedQueueMatchList: (state, action) => {
            state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedMatchList
            state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedMatchList
            .map(match => match.info.participants
                .filter(participant => participant.summonerName === action.payload))
                .flatMap(arr => arr)
                .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
            ))
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchingAddMatchList.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchingAddMatchList.fulfilled, (state, action) => {
            const {type} = action.payload;
            if(type === 'ALL') {
                state.loading = false;
                state.getAddedMatch.addedMatchList = [...(state.getAddedMatch.addedMatchList ?? []), ...(action.payload.addedMatchList ?? [])]
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedMatchList
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedMatchList
                    .map(match => match.info.participants.filter(participant => participant.summonerName === action.payload.name))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 420) {
                state.loading = false;
                state.getAddedMatch.addedSoloRankMatchList = [...(state.getAddedMatch.addedSoloRankMatchList ?? []), ...(action.payload.addedMatchList ?? [])]
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedSoloRankMatchList
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedSoloRankMatchList
                    .map(match => match.info.participants.filter(participant => participant.summonerName === action.payload.name))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 440) {
                state.loading = false;
                state.getAddedMatch.addedTeamRankMatchList = [...(state.getAddedMatch.addedTeamRankMatchList ?? []), ...(action.payload.addedMatchList ?? [])]
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedTeamRankMatchList
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedTeamRankMatchList
                    .map(match => match.info.participants.filter(participant => participant.summonerName === action.payload.name))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 450) {
                state.loading = false;
                state.getAddedMatch.addedARAMMatchList = [...(state.getAddedMatch.addedARAMMatchList ?? []), ...(action.payload.addedMatchList ?? [])]
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedARAMMatchList
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedARAMMatchList
                    .map(match => match.info.participants.filter(participant => participant.summonerName === action.payload.name))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
            else if(type === 490) {
                state.loading = false;
                state.getAddedMatch.addedQuickMatchList = [...(state.getAddedMatch.addedQuickMatchList ?? []), ...(action.payload.addedMatchList ?? [])]
                state.getAddedMatch.filteredAddedMatchList = state.getAddedMatch.addedQuickMatchList
                state.getAddedMatch.addedRecentPlayed3Champion = recentMostChamp(state.getAddedMatch.addedQuickMatchList
                    .map(match => match.info.participants.filter(participant => participant.summonerName === action.payload.name))
                    .flatMap(arr => arr)
                    .map(match => ({championName : match.championName, win: match.win, kda: match.challenges.kda})
                ))
            }
        })
    }
})
export const {filteredAddedQueueMatchList, allAddedQueueMatchList, resetAddedMatchList} = addedMatchListSlice.actions;
export default addedMatchListSlice.reducer