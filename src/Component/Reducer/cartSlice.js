import { createSlice } from "@reduxjs/toolkit";


const initialState = JSON.parse(localStorage.getItem("cart")) || {
    items: [], // Giỏ hàng chứa các sản phẩm
    total: 0,  // Tổng giá trị sản phẩm trong giỏ hàng
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addUpdateProduct: (state, action) => {
            // Kiểm tra trạng thái đăng nhập từ Redux store
          

            let item = action.payload;
            let existProduct = state.items.find(i => i.id === item.id);
            if (!existProduct) {
                let money = Math.round(item.price * item.quantity);
                state.items.push({ ...item, totalItem: money });
                state.total += money;
            } else {
                if (item.quantity > 0) {
                    let soluong = Number(item.quantity - existProduct.quantity);
                    let money = Math.round(item.price * soluong);

                    existProduct.quantity += soluong;
                    existProduct.totalItem += money;
                    state.total += money;
                } else {
                    let indexItem = state.items.findIndex(i => i.id === item.id);
                    state.total -= state.items[indexItem].totalItem;
                    state.items.splice(indexItem, 1);
                }
            }
            localStorage.setItem("cart", JSON.stringify(state));
        },

        removeProduct: (state, action) => {
            let item = action.payload;
            let indexItem = state.items.findIndex(i => i.id === item.id);
            state.total -= state.items[indexItem].totalItem;
            state.items.splice(indexItem, 1);
            localStorage.setItem("cart", JSON.stringify(state));
        }
    }
});

export const { addUpdateProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
