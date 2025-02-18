import { useEffect, useState } from "react";
import "../../../../public/css/login.css"
import axios from "axios";
import { logIn } from "../../Reducer/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [input, setInput] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate()

    let setData = (e) => {
        let n = e.target.name;
        let v = e.target.value;
        setInput({...input,[n] : v})
        console.log(input)
    }

    let dangnhap = (e) => {
        e.preventDefault();
        axios.post('https://dummyjson.com/user/login', {
            username: input.user,
            password: input.password,
            expiresInMins: 30,
        })
        .then(kQ => {
          
                dispatch(logIn(kQ.data));
                alert('Đăng nhập thành công');
                navigate("/shop")
                window.location.reload()
                
            
        })
        .catch(error => {
            console.error(error);
            alert('Đăng nhập thất bại! Username hoặc Password sai');
        });
    }

    return (
        
        <body style= {{ margin: '30px'}}>
            <div className="border">
            <form onSubmit={dangnhap}>
                <h3 style={{color: "black", fontWeight:"bold",marginTop: "15px",fontFamily: "sans-serif"}}>Đăng nhập</h3>
                <input className="blue" type="text" name="user" placeholder="Username" onChange={setData} />{" "}
                <br />
                <input className="blue" type="password" name="password" placeholder="Password" onChange={setData}/> <br />
                <button className="button1">Đăng nhập</button> <br/>
                <a href="">Quên mật khẩu?</a> <br />
                <p className="a" />
                <button className="button2">Tạo tài khoản mới</button>
                </form>
        </div>
        </body>
        
      
       
    );
}

export default Login;