import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getArticleList } from "../../api/getData";


export const fetchingBoardList = createAsyncThunk(
    'boardList/get',
    async () => await getArticleList()
)

export const boardSlice = createSlice({
    name: 'boardList',
    initialState: {
        loading: false,
        getBoard: {
            articleList: [],
            filteredArticleList: []
        }

    },
    reducers: {
        selectAndClickedAndUpdateArticleList: (state, action) => {
            const { queueType, tierType, positionType } = action.payload;
            const parsePosition = positionType === 'Top' ? '탑' : positionType === 'Jungle' ? '정글' : positionType === 'Middle' ? '미드' : positionType === 'Bottom' ? '원딜' : positionType === 'Support' ? '서폿' : '';

            const filterByTier = (article) => tierType === 'ALL' || article.tier.tierName === tierType;
            const filterByPosition = (article) => positionType === 'ALL' || article.title.includes(parsePosition);
            const filterByQueueType = (article) => article.queueType === queueType;

            switch (queueType) {
                case 'ALL':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByTier(article) && filterByPosition(article));
                    break;
                case '무작위 총력전':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article));
                    break;
                case '일반':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article));
                    break;
                case '솔로랭크':
                case '자유랭크':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article) && filterByTier(article));
                    break;
                default:
                    break;
            }
            
        },
        selectedQueueArticleList: (state, action) => {
            const { queueType, tierType, positionType } = action.payload;
            const parsePosition = positionType === 'Top' ? '탑' : positionType === 'Jungle' ? '정글' : positionType === 'Middle' ? '미드' : positionType === 'Bottom' ? '원딜' : positionType === 'Support' ? '서폿' : '';
            // console.log('selectedQueue', action.payload);

            const filterByTier = (article) => tierType === 'ALL' || article.tier.tierName === tierType;
            const filterByPosition = (article) => positionType === 'ALL' || article.title.includes(parsePosition);
            const filterByQueueType = (article) => article.queueType === queueType;

            switch (queueType) {
                case 'ALL':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByTier(article) && filterByPosition(article));
                    break;
                case '무작위 총력전':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article));
                    break;
                case '일반':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article));
                    break;
                case '솔로랭크':
                case '자유랭크':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article) && filterByTier(article));
                    break;
                default:
                    break;
            }
        },
        selectedTierArticleList: (state, action) => {
            const { queueType, tierType, positionType } = action.payload;
            const parsePosition = positionType === 'Top' ? '탑' : positionType === 'Jungle' ? '정글' : positionType === 'Middle' ? '미드' : positionType === 'Bottom' ? '원딜' : positionType === 'Support' ? '서폿' : '';
            // console.log('selectedTier', action.payload);

            const filterByTier = (article) => tierType === 'ALL' || article.tier.tierName === tierType;
            const filterByPosition = (article) => positionType === 'ALL' || article.title.includes(parsePosition);
            const filterByQueueType = (article) => article.queueType === queueType;

            switch (queueType) {
                case 'ALL':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByTier(article) && filterByPosition(article));
                    break;
                case '무작위 총력전':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article));
                    break;
                case '일반':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article));
                    break;
                case '솔로랭크':
                case '자유랭크':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article) && filterByTier(article));
                    break;
                default:
                    break;
            }
        },
        clickedPositionArticleList: (state, action) => {
            const { queueType, tierType, positionType } = action.payload;
            const parsePosition = positionType === 'Top' ? '탑' : positionType === 'Jungle' ? '정글' : positionType === 'Middle' ? '미드' : positionType === 'Bottom' ? '원딜' : positionType === 'Support' ? '서폿' : '';
            // console.log('clickedPosition', action.payload);

            const filterByTier = (article) => tierType === 'ALL' || article.tier.tierName === tierType;
            const filterByPosition = (article) => positionType === 'ALL' || article.title.includes(parsePosition);
            const filterByQueueType = (article) => article.queueType === queueType;

            switch (queueType) {
                case 'ALL':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByTier(article) && filterByPosition(article));
                    break;
                case '무작위 총력전':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article));
                    break;
                case '일반':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article));
                    break;
                case '솔로랭크':
                case '자유랭크':
                    state.getBoard.filteredArticleList = state.getBoard.articleList.filter((article) => filterByQueueType(article) && filterByPosition(article) && filterByTier(article));
                    break;
                default:
                    break;
            }
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchingBoardList.pending, (state) => {
            // state.loading = true;
        })
        .addCase(fetchingBoardList.fulfilled, (state, action) => {
            // state.loading = false;
            state.getBoard.articleList = action.payload
            state.getBoard.filteredArticleList = action.payload
        })
    }
})

export const {clickedPositionArticleList, selectAndClickedAndUpdateArticleList, selectedQueueArticleList, selectedTierArticleList} = boardSlice.actions
export default boardSlice.reducer