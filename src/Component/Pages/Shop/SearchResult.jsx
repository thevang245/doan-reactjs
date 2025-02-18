import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ItemProduct from "./ItemProduct";

function SearchResult() {
  const [data, setData] = useState({ sanpham: [], isLoading: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city");
  const district = queryParams.get("district");
  const ward = queryParams.get("ward");
  const category = queryParams.get("category");

  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });
  const [sizeFilter, setSizeFilter] = useState({ min: null, max: null });

  useEffect(() => {
    console.log("City:", city); // Kiểm tra city nhận được
  }, [city]);


  // Gọi API tìm kiếm khi các tham số tìm kiếm chính thay đổi
  useEffect(() => {
    if (!city) return;

    // Reset lại bộ lọc khi tìm kiếm lại (không áp dụng bộ lọc giá và diện tích)
    setPriceFilter({ min: null, max: null });
    setSizeFilter({ min: null, max: null });

    setData((prev) => ({ ...prev, isLoading: true }));

    let query = `city=${city}`;
    if (district) query += `&district=${district}`;
    if (ward) query += `&ward=${ward}`;
    if (category) query += `&category=${category}`;

    // Gọi API mà không có bộ lọc giá và diện tích
    axios
      .get(`http://localhost:5000/api/search?${query}&page=${currentPage}&limit=${itemsPerPage}`)
      .then((response) => {
        setData({ sanpham: response.data.posts, isLoading: false });
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, [city, district, ward, category, currentPage]); // Chỉ gọi API khi thay đổi các tham số tìm kiếm chính

  // Hàm lọc dữ liệu theo giá
  const handlePriceFilter = (min, max) => {
    setPriceFilter({ min, max });
  };

  const totalPosts = data.sanpham.length;

  // Hàm lọc dữ liệu theo diện tích
  const handleSizeFilter = (min, max) => {
    setSizeFilter({ min, max });
  };

  // Cập nhật lại khi có thay đổi về bộ lọc giá hoặc diện tích
  useEffect(() => {
    if (!city) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setData((prev) => ({ ...prev, isLoading: true }));

    let query = `city=${city}`;
    if (district) query += `&district=${district}`;
    if (ward) query += `&ward=${ward}`;
    if (category) query += `&category=${category}`;
    if (priceFilter.min !== null) query += `&minPrice=${priceFilter.min}`;
    if (priceFilter.max !== null) query += `&maxPrice=${priceFilter.max}`;
    if (sizeFilter.min !== null) query += `&minSize=${sizeFilter.min}`;
    if (sizeFilter.max !== null) query += `&maxSize=${sizeFilter.max}`;

    // Gọi API với các bộ lọc giá và diện tích
    axios
      .get(`http://localhost:5000/api/search?${query}&page=${currentPage}&limit=${itemsPerPage}`)
      .then((response) => {
        setData({ sanpham: response.data.posts, isLoading: false });
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, [priceFilter, sizeFilter, currentPage]); // Chỉ gọi API khi bộ lọc giá, diện tích, hoặc trang thay đổi

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300); // Thêm một chút độ trễ để đảm bảo cuộn mượt hơn
      setCurrentPage(page);
    }
  };


  return (
    <section className="shop spad">
      <div className="container">
        <div className="row">

          <div className="col-lg-9">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="">
                  <p className="!text-xl !font-bold !text-blue-400 text-uppercase !m-0">
                    {category ? `${category} ở` : ''} {city}
                  </p>
                  <p className="!text-base  !text-blue-400 !m-0">
                    Có {totalPosts} bài đăng cho thuê
                  </p>
                </div>
              </div>
            </div>

            <div className="column">
              {data.sanpham.length > 0 ? (
                data.sanpham.map((item) => (
                  <ItemProduct key={item._id} sanpham={item} />
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg font-semibold">
                  Không có kết quả nào phù hợp
                </p>
              )}
            </div>


            {/* Phân trang */}
            <div className="pagination mt-4 text-center items-center  flex justify-center">
              <button
                className="px-3 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                « Trước
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
                    }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="px-3 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau »
              </button>
            </div>
          </div>

          {/* Phần bên phải: Bộ lọc */}
          <div className="col-lg-3">
            <div className="shop__sidebar bg-gradient-to-r from-blue-400 to-sky-400 rounded p-4 mt-13">
              <div className="shop__sidebar__accordion">
                <div className="accordion" id="accordionExample">
                  {/* Lọc theo giá */}
                  <div className="card !bg-gradient-to-r from-blue-400 to-sky-400">
                    <div className="card-heading">
                      <h5 className="text-center !font-bold !text-mx text-white m-0 mb-2">
                        Lọc theo giá
                      </h5>
                    </div>
                    <div id="collapseOne" className="show m-0">
                      <div className="card-body">
                        <div className="shop__sidebar__categories">
                          <ul className="nice-scroll m-0">
                            <li onClick={() => handlePriceFilter(0, 1000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i>  Dưới 1 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(1000000, 2000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 1 triệu - 2 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(2000000, 3000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 2 triệu - 3 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(3000000, 5000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i>  Từ 3 triệu - 5 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(5000000, 7000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 5 triệu - 7 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(7000000, 10000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 7 triệu - 10 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(10000000, 15000000)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 10 triệu - 15 triệu
                              </a>
                            </li>
                            <li onClick={() => handlePriceFilter(15000000, null)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i>  Trên 15 triệu
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lọc theo diện tích */}
                  <div className="card bg-gradient-to-r from-blue-400 to-sky-400">
                    <div className="card-heading">
                      <h5 className="text-center !font-bold !text-mx text-white m-0 mb-2">
                        Lọc theo diện tích
                      </h5>
                    </div>
                    <div id="collapseTwo" className="show">
                      <div className="card-body">
                        <div className="shop__sidebar__brand">
                          <ul className="m-0">
                            <li onClick={() => handleSizeFilter(0, 20)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i>  Dưới 20m²
                              </a>
                            </li>
                            <li onClick={() => handleSizeFilter(20, 30)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 20m² - 30m²
                              </a>
                            </li>
                            <li onClick={() => handleSizeFilter(30, 50)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 30m² - 50m²
                              </a>
                            </li>
                            <li onClick={() => handleSizeFilter(50, 70)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i> Từ 50m² - 70m²
                              </a>
                            </li>
                            <li onClick={() => handleSizeFilter(70, 90)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i>  Từ 70m² - 90m²
                              </a>
                            </li>
                            <li onClick={() => handleSizeFilter(90, null)}>
                              <a href="#" className="!text-white">
                                <i className="fa-solid fa-chevron-right text-white pr-2"></i>  Trên 90m²
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  );
}

export default SearchResult;
