import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAccount, logutAccount } from "../../api/postData";
import { getAuth } from "../../api/getData";

export const fetchAuthUserData = createAsyncThunk(
    'auth/get',
    (_, {rejectWithValue}) => getAuth().then(response => response.data).catch(error => rejectWithValue(error.response.data))
)

export const fetchLogoutAccount = createAsyncThunk(
    'logout/get',
    (userInfo) => logutAccount(userInfo).then(response => response.data).catch(error => error.response.data)

)

export const fetchLoginAccount = createAsyncThunk(
    'login/post',
    (userInfo, { rejectWithValue }) => loginAccount(userInfo)
    .then(response => response.data)
    .catch(error => rejectWithValue(error.response.data))
)

export const loginUserSlice = createSlice({
    name : 'loginUser',
    initialState: {
        getUser: {
            userInfo : '',
            loginStatus : false,
        },
        message: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchLoginAccount.fulfilled, (state, action) => {
            state.getUser.loginStatus = action.payload.loginStatus;
            state.message = '';
        })
        .addCase(fetchLoginAccount.rejected, (state, action) => {
            state.message = action.payload.message;
        })
        .addCase(fetchLogoutAccount.fulfilled, (state, action) => {
            state.getUser.loginStatus = action.payload.loginStatus;
            state.getUser.userInfo = '';
            state.message = '';
        })
        .addCase(fetchAuthUserData.fulfilled, (state, action) => {
            state.getUser.userInfo = action.payload;
        })
    }
})

export default loginUserSlice.reducer