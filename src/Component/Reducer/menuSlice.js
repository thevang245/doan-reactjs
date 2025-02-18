import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMenu = createAsyncThunk('', async () => {
    const kQ = await axios.get('https://dummyjson.com/products/categories')
    return kQ.data;
})

const menuSlice = createSlice( {
    name: 'menu',
    initialState: {
        items: [],
        status: 'notworking', // notworking, loading, success, failled
        value: 'beauty'
    },
    reducers: {
        thaydoiMenu: (state, action) => {
            let menu = action.payload;
            state.value = menu;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMenu.pending, (state) => {
            state.status = 'loading';

        }).addCase(fetchMenu.fulfilled, (state, action) => {
            state.status = 'successed';
            state.items = action.payload;
        }).addCase(fetchMenu.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export const {thaydoiMenu} = menuSlice.actions;
export default menuSlice.reducer;