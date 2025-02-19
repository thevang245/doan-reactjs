import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signin() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    // Tự động điền thông tin nếu có trong localStorage
    useEffect(() => {
        const savedPhone = localStorage.getItem("savedPhone");
        const savedPassword = localStorage.getItem("savedPassword");
        const savedRemember = localStorage.getItem("rememberMe");
        
        if (savedRemember === "true" && savedPhone && savedPassword) {
            setPhone(savedPhone);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("Đăng nhập thành công!");
    
                // Lưu token để xác thực
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("loginStatus", true);
                localStorage.setItem("user", JSON.stringify(data.user));
    
                // Lưu thông tin nếu chọn "Nhớ mật khẩu"
                if (rememberMe) {
                    localStorage.setItem("savedPhone", phone);
                    localStorage.setItem("savedPassword", password);
                    localStorage.setItem("rememberMe", true);
                } else {
                    localStorage.removeItem("savedPhone");
                    localStorage.removeItem("savedPassword");
                    localStorage.removeItem("rememberMe");
                }
    
                navigate("/"); // Chuyển hướng sau khi đăng nhập
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-xl p-6 space-y-6 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-4xl font-bold text-blue-700 dark:text-white text-center">
                    TimtroOnline
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            Số điện thoại
                        </label>
                        <input
                            type="number"
                            className="!w-full !p-2.5 !bg-gray-50 !border !rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            className="w-full p-2.5 bg-gray-50 border rounded-lg"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Ghi nhớ và đăng ký */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                Nhớ mật khẩu
                            </label>
                        </div>
                        <Link className="!text-blue-500 !text-sm !block !text-right" to="/sign-up">Chưa có tài khoản? Đăng ký ngay</Link>
                    </div>

                    {/* Nút đăng nhập */}
                    <button
                        type="submit"
                        className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signin;
