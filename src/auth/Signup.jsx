import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !phone || !password || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không trùng khớp!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/sign-in"); // Chuyển hướng đến trang đăng nhập
            } else {
                alert(data.message || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-xl p-6 space-y-6 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="!text-4xl !font-bold !text-blue-700 !dark:text-white !text-center">
                    TimtroOnline
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            Tên đầy đủ
                        </label>
                        <input
                            type="text"
                            className="!w-full !p-2.5 bg-gray-50 !border !rounded-lg"
                            placeholder="Nhập tên của bạn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                            className="!w-full !p-2.5 !bg-gray-50 !border !rounded-lg"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            className="!w-full p-2.5 !bg-gray-50 !border !rounded-lg"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* Điều khoản & Liên kết đăng nhập */}
                    <div className="flex justify-end">

                        <Link to="/sign-in" className="!text-blue-500 !text-sm !block !text-right">
                            Đã có tài khoản? Đăng nhập ngay
                        </Link>

                    </div>

                    {/* Nút Đăng ký */}
                    <button
                        type="submit"
                        className="w-full px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
