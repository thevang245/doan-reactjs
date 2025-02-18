import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: localStorage.getItem('loginStatus') === 'true' || false, // trạng thái đăng nhập
  info: JSON.parse(
    localStorage.getItem('userInfor') === "undefined" || !localStorage.getItem('userInfor') 
      ? '{}' 
      : localStorage.getItem('userInfor')
  ),
  
  
};
console.log(localStorage.getItem('userInfor'));


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action) => {
      let user = action.payload;
      state.info = user;
      state.login = true;
      localStorage.setItem('loginStatus', 'true'); // Luôn lưu dưới dạng chuỗi
      localStorage.setItem('userInfor', JSON.stringify(user)); // Lưu thông tin người dùng
    },
    logOut: (state) => {
      state.info = {};
      state.login = false;
      localStorage.removeItem('loginStatus'); // Xóa trạng thái đăng nhập
      localStorage.removeItem('userInfor'); // Xóa thông tin người dùng
    }
  }
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
