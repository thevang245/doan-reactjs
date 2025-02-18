import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ItemProduct from "./ItemProduct";
import { useSearchParams } from "react-router-dom";

function House() {
  const menu = useSelector((state) => state.menu.value);
  const [data, setData] = useState({ sanpham: [], isLoading: false });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [totalItems, setTotalItems] = useState();
  const [totalPages, setTotalPages] = useState(1); // Thêm state lưu tổng số trang

  // State lưu bộ lọc
  const [vSearch, setvSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
    const [priceFilter, setPriceFilter] = useState({
      min: searchParams.get("gia_tu") || null,
      max: searchParams.get("gia_den") || null,
    });
    const [sizeFilter, setSizeFilter] = useState({
      min: searchParams.get("dien_tich_tu") || null,
      max: searchParams.get("dien_tich_den") || null,
    });
    const updateFilters = (newFilters) => {
      setSearchParams((prev) => {
        const updatedParams = new URLSearchParams(prev);
    
        // Cập nhật giá nếu có
        if (newFilters.price) {
          updatedParams.set("gia_tu", newFilters.price.min);
          if (newFilters.price.max !== null) {
            updatedParams.set("gia_den", newFilters.price.max);
          } else {
            updatedParams.delete("gia_den"); // Xóa nếu max === null
          }
        }
    
        // Cập nhật diện tích nếu có
        if (newFilters.size) {
          updatedParams.set("dien_tich_tu", newFilters.size.min);
          if (newFilters.size.max !== null) {
            updatedParams.set("dien_tich_den", newFilters.size.max);
          } else {
            updatedParams.delete("dien_tich_den"); // Xóa nếu max === null
          }
        }
    
        return updatedParams;
      });
    };

  // Hàm gọi API với bộ lọc hiện tại
  const fetchData = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios
      .get(`http://localhost:5000/api/posts`, {
        params: {
          page: currentPage,
          category: "Nhà nguyên căn",
          search: vSearch,
          minPrice: searchParams.get("gia_tu"),
          maxPrice: searchParams.get("gia_den"),
          minSize: searchParams.get("dien_tich_tu"),
          maxSize: searchParams.get("dien_tich_den"),
        },
      })
      .then((kQ) => {
        setData({ sanpham: kQ.data.posts, isLoading: false });
        setTotalPages(kQ.data.totalPages);
      })
      .catch((e) => console.error("Lỗi khi gọi API:", e));
  };

  // Gọi API khi trang hoặc bộ lọc thay đổi
  useEffect(() => {
    fetchData();
  }, [currentPage, priceFilter, sizeFilter,searchParams]);

  // Hàm xử lý lọc theo giá
  const handlePriceFilter = (min, max) => {
    updateFilters({ price: { min, max } });
    setCurrentPage(1);
  };

  const handleSizeFilter = (min, max) => {
    updateFilters({ size: { min, max } });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100); // Thêm một chút độ trễ để đảm bảo cuộn mượt hơn
      setCurrentPage(page);
      
    }
  };

  return (
    <>
      <section className="shop spad">
        <div className="container">
          <div className="row">
            {/* Danh sách sản phẩm */}
            <div className="col-lg-9">
              <div className="row">
                <div className="col-lg-6">
                  <p className="!text-xl !font-bold !text-blue-400 text-uppercase !m-0">
                    Danh sách các bài đăng mới nhất
                  </p>
                </div>
              </div>
              <div className="column">
                {data.sanpham.length > 0 ? (
                  data.sanpham.map((i) => <ItemProduct key={i.id} sanpham={i} />)
                ) : (
                  <div className="text-center justify-between items-center p-12">
                    <h5 className="!text-lg !text-red-500">Không có bài đăng nào phù hợp!</h5>
                  </div>
                )}
              </div>
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
                    className={`px-3 py-2 mx-1 rounded ${
                      currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
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

            {/* Bộ lọc */}
            <div className="col-lg-3">
              <div className="shop__sidebar border-1 !border-blue-300 rounded p-4 mt-13">
                <div className="shop__sidebar__accordion">
                  <div className="accordion" id="accordionExample">
                    {/* Lọc theo giá */}
                    <div className="card">
                      <div className="card-heading">
                        <h5 className="text-center !font-bold !text-mx text-blue-400 m-0 mb-2">Lọc theo giá</h5>
                      </div>
                      <div id="collapseOne" className="show m-0">
                        <div className="card-body">
                          <div className="shop__sidebar__categories">
                            <ul className="nice-scroll m-0">
                              {[
                                { label: "Dưới 1 triệu", min: 0, max: 1000000 },
                                { label: "Từ 1 triệu - 2 triệu", min: 1000000, max: 2000000 },
                                { label: "Từ 2 triệu - 3 triệu", min: 2000000, max: 3000000 },
                                { label: "Từ 3 triệu - 5 triệu", min: 3000000, max: 5000000 },
                                { label: "Từ 5 triệu - 7 triệu", min: 5000000, max: 7000000 },
                                { label: "Từ 7 triệu - 10 triệu", min: 7000000, max: 10000000 },
                                { label: "Từ 10 triệu - 15 triệu", min: 10000000, max: 15000000 },
                                { label: "Trên 15 triệu", min: 15000000, max: null }
                              ].map(({ label, min, max }, index) => (
                                <li key={index} className="mb-2">
                                  <button
                                    className="!text-blue-400 bg-transparent border-none cursor-pointer"
                                    onClick={() => handlePriceFilter(min, max)}
                                  >
                                    <i className="fa-solid fa-chevron-right text-blue-400 pr-2"></i> {label}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lọc theo diện tích */}
                    <div className="card">
                      <div className="card-heading">
                        <h5 className="text-center !font-bold !text-mx text-blue-400 m-0 mb-2">Lọc theo diện tích</h5>
                      </div>
                      <div id="collapseTwo" className="show">
                        <div className="card-body">
                          <div className="shop__sidebar__brand">
                            <ul className="m-0">
                              {[
                                { label: "Dưới 20m²", min: 0, max: 20 },
                                { label: "Từ 20m² - 30m²", min: 20, max: 30 },
                                { label: "Từ 30m² - 50m²", min: 30, max: 50 },
                                { label: "Từ 50m² - 70m²", min: 50, max: 70 },
                                { label: "Từ 70m² - 90m²", min: 70, max: 90 },
                                { label: "Trên 90m²", min: 90, max: null }
                              ].map(({ label, min, max }, index) => (
                                <li key={index} className="mb-2">
                                  <button
                                    className="!text-blue-400 bg-transparent border-none cursor-pointer"
                                    onClick={() => handleSizeFilter(min, max)}
                                  >
                                    <i className="fa-solid fa-chevron-right text-blue-400 pr-2"></i> {label}
                                  </button>
                                </li>
                              ))}
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
    </>
  );
}

export default House;
