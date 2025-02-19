import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchMenu } from "../Reducer/menuSlice";
import allCities from "../dvhcvn.json"; // Import file dữ liệu toàn bộ thành phố, quận huyện, phường xã
function Header() {
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const loginStatus = JSON.parse(localStorage.getItem("loginStatus"));

  const [activeMenu, setActiveMenu] = useState("/");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [category, setCategory] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");        
    localStorage.removeItem("loginStatus"); 
  
    setShowDropdown(false); // Đóng dropdown trước
    setTimeout(() => {
      window.location.reload(); // Reload sau khi dropdown đã đóng
    }, 200); // Đợi 200ms để React cập nhật UI
  };
  
  

  // Dữ liệu thành phố lấy từ file JSON
  const data = allCities.data.reduce((acc, cityData) => {
    const cityName = cityData.name; // Thành phố
    const districts = cityData.level2s.reduce((districtAcc, districtData) => {
      const districtName = districtData.name; // Quận/Huyện
      const wards = districtData.level3s.map(wardData => wardData.name); // Phường/Xã
      districtAcc[districtName] = wards;
      return districtAcc;
    }, {});
    acc[cityName] = districts;
    return acc;
  }, {});

  // Lấy giá trị từ URL query params khi trang được tải lại
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Cập nhật các giá trị state từ query string
    setCity(queryParams.get("city") || "");
    setDistrict(queryParams.get("district") || "");
    setWard(queryParams.get("ward") || "");
    setCategory(queryParams.get("category") || ""); // Cập nhật lại category từ query string
  }, [location.search]); // Khi query params thay đổi, cập nhật lại giá trị trong form

  // Cập nhật giá trị thành phố khi chọn thành phố
  const handleCityChange = (e) => {
    setCity(e.target.value);
    setDistrict("");  // Reset lại quận khi chọn thành phố mới
    setWard("");      // Reset lại phường khi chọn thành phố mới
  };

  // Cập nhật giá trị quận/huyện khi chọn quận
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setWard("");      // Reset lại phường khi chọn quận mới
  };

  // Cập nhật giá trị loại hình (category)
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Cập nhật menu active theo URL
  useEffect(() => {
    if (menu.status === "notworking") {
      dispatch(fetchMenu());
    }
  }, [menu.status, dispatch]);

  // Cập nhật menu active theo URL
  useEffect(() => {
    if (location.pathname === "/posts") {
      setCategory("Phòng trọ");
    } else if (location.pathname === "/apartments") {
      setCategory("Căn hộ");
    } else if (location.pathname === "/houses") {
      setCategory("Nhà nguyên căn");
    } else if (location.pathname === "/") {
      setCategory("Loại hình");
    }
  }, [location.pathname]);

  const handleMenuClick = (path) => {
    setActiveMenu(path);
  };

  // Hàm tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!city) return; // Kiểm tra nếu chưa chọn thành phố thì không tìm kiếm

    // Tạo query string từ các giá trị đang chọn
    const query = new URLSearchParams({ city, district, ward, category }).toString();

    // Điều hướng đến trang tìm kiếm với query params
    navigate(`/search?${query}`);
  };

  return (
    <>
      {/* Header Section Begin */}
      <header className="sticky top-0 z-20 bg-white shadow-md header bg-gradient-to-r from-blue-500 to-sky-400 w-full relative">
        {/* Logo and Phone Section */}
        <div className="container py-0 flex shadow-lg justify-between items-center bg-white rounded-tl-none rounded-tr-none rounded-bl-full rounded-br-full !w-full relative">
          <div className="header__logo w-full">
            <Link to="/">
              <h3>TimtroOnline</h3>
            </Link>
          </div>

          {/* Đảm bảo các phần tử không bị xuống dòng */}
          <div className="!flex items-center !gap-4 !pr-4">
            <Link to="/saved-posts" className="!text-blue-500 !hover:text-red-700 !flex !items-center !whitespace-nowrap">
              <i className="fa-solid fa-heart !fa-fw !mr-1"></i>
              Bài đã lưu
            </Link>

            {loginStatus ? (
              // Nếu đã đăng nhập, hiển thị button tên user + dropdown
              <div className="relative">
                <button
                  className="text-blue-500  flex items-center whitespace-nowrap"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <i className="fa-solid fa-circle-user fa-fw mr-1"></i>
                  {user.name}
                </button>

                {/* Dropdown thông tin */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-3 border border-gray-200">
                    <p className="font-bold text-gray-700"><i className="text-blue-500 fa-regular fa-address-book p-2"></i>{user.name}</p>
                    <p className="text-gray-600"><i className="text-blue-500 fa-solid fa-square-phone p-2"></i>{user.phone}</p>
                    <hr className="my-2" />
                    <button className="text-red-500 hover:text-red-700 w-full text-left" onClick={handleLogout}>
                    <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Nếu chưa đăng nhập, hiển thị Link chuyển đến trang đăng nhập
              <Link to="/sign-in" className="!text-blue-500 !hover:text-red-700 !flex !items-center !whitespace-nowrap">
                <i className="fa-solid fa-circle-user fa-fw mr-1"></i>
                Đăng nhập
              </Link>
            )}

          </div>



        </div>




        <div className="py-0">
          <nav className="header__menu mobile-menu">
            <ul className="flex justify-center space-x-6 py-0 m-0">
              <li className={activeMenu === "/" ? "active" : ""}>
                <Link to="/" onClick={() => handleMenuClick("/")}>Trang chủ</Link>
              </li>
              <li className={activeMenu === "/posts" ? "active" : ""}>
                <Link to="/posts" onClick={() => handleMenuClick("/posts")}>Phòng trọ</Link>
              </li>
              <li className={activeMenu === "/apartments" ? "active" : ""}>
                <Link to="/apartments" onClick={() => handleMenuClick("/apartments")}>Căn hộ</Link>
              </li>
              <li className={activeMenu === "/houses" ? "active" : ""}>
                <Link to="/houses" onClick={() => handleMenuClick("/houses")}>Nhà nguyên căn</Link>
              </li>
            </ul>
          </nav>
        </div>


        {/* Search Section */}
        <div className="container py-0">
          <div className="flex justify-center items-center p-2 border-white">
            <div className="inline-flex gap-4 border-4 border-white p-2 px-5 bg-white rounded shadow-md items-center">

              {/* Dropdown chọn loại bất động sản */}
              <select
                className="border !border-blue-300 px-2 rounded bg-white text-sm w-40 h-10 text-ellipsis overflow-hidden whitespace-nowrap"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Loại hình</option>
                <option value="Phòng trọ">Phòng trọ</option>
                <option value="Căn hộ">Căn hộ chung cư</option>
                <option value="Nhà nguyên căn">Nhà nguyên căn</option>
              </select>

              {/* Dropdown chọn Tỉnh/Thành phố */}
              <select
                className="border !border-blue-300 px-2 rounded bg-white text-sm w-40 h-10 text-ellipsis overflow-hidden whitespace-nowrap"
                value={city}
                onChange={handleCityChange}
              >
                <option value="">Tỉnh/Thành phố</option>
                {Object.keys(data).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Dropdown chọn Quận/Huyện */}
              <select
                className="border !border-blue-300 px-2 rounded bg-white text-sm w-40 h-10 text-ellipsis overflow-hidden whitespace-nowrap"
                value={district}
                onChange={handleDistrictChange}
                disabled={!city}
              >
                <option value="">Quận/Huyện</option>
                {city &&
                  Object.keys(data[city]).map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
              </select>

              {/* Dropdown chọn Phường/Xã */}
              <select
                className="border !border-blue-300 px-2 rounded bg-white text-sm w-40 h-10 text-ellipsis overflow-hidden whitespace-nowrap"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                disabled={!district}
              >
                <option value="">Phường/Xã</option>
                {district &&
                  data[city][district].map((ward) => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
              </select>

              {/* Nút tìm kiếm */}
              <button
                className="bg-blue-400 text-white px-4 h-10 font-bold rounded flex items-center justify-center text-sm"
                onClick={handleSearch}
              >
                Tìm kiếm
              </button>

            </div>
          </div>
        </div>
      </header>
      {/* Header Section End */}
    </>
  );
}

export default Header;
