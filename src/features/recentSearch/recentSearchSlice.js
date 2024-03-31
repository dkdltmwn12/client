import { createSlice } from "@reduxjs/toolkit";


export const recentSearhedSlice = createSlice({
    name : 'recentSearched',
    initialState: {
        getRecent: {
            getRecentSearchList: [],
            getBookMarkList: [],
        }
    },
    reducers: {
        addRecentSearchedSummonerList: (state, action) => {
            const {name, tag, bookMark} = action.payload
            if(!state.getRecent.getRecentSearchList.some(target => target.name === name)) {
                state.getRecent.getRecentSearchList.push({name, tag, bookMark});
            }
        },
        deleteRecentSearchedSummoner: (state, action) => {
            for(let i = 0;  i < state.getRecent.getRecentSearchList.length; i++) {
                if(state.getRecent.getRecentSearchList[i].name === action.payload.name) {
                    state.getRecent.getRecentSearchList.splice(i, 1)
                }
            }
        },
        addSummonerBookMark: (state, action) => {
            const {name, tag} = action.payload;
            state.getRecent.getRecentSearchList = state.getRecent.getRecentSearchList.map(target => target.name === name ? ({...target, bookMark : true}) : target)
            if(!state.getRecent.getBookMarkList.some(target => target.name === name)) {
                state.getRecent.getBookMarkList.push({name, tag})
            }
        },
        deleteSummonerBookMark: (state, action) => {
            state.getRecent.getRecentSearchList = state.getRecent.getRecentSearchList.map(target => target.name === action.payload ? ({...target, bookMark : false}) : target)
            for(let i = 0; i < state.getRecent.getBookMarkList.length; i++) {
                if(state.getRecent.getBookMarkList[i].name === action.payload) {
                    state.getRecent.getBookMarkList.splice(i, 1)
                }
            }
        }
    }
});

export const {addRecentSearchedSummonerList, deleteRecentSearchedSummoner, addSummonerBookMark, deleteSummonerBookMark} = recentSearhedSlice.actions;
export default recentSearhedSlice.reducer