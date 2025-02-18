import { configureStore } from "@reduxjs/toolkit";
import menuReduce from "./Reducer/menuSlice.js";
import cartReduce from "./Reducer/cartSlice.js"
import userSlice from "./Reducer/userSlice.js"

const store = configureStore( {
    reducer: {
        menu: menuReduce,
        cart: cartReduce,
        user: userSlice
    }
})

export default store;