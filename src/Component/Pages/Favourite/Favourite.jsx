import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ItemProduct from "../Shop/ItemProduct";

function Favourite() {
  const menu = useSelector((state) => state.menu.value);
  const [data, setData] = useState({ sanpham: [], isLoading: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 3;
  const user = JSON.parse(localStorage.getItem("user"));

  // Gọi API lấy bài viết yêu thích
  const fetchFavouritePosts = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/favourites/${user.id}`);
      setData({ sanpham: response.data || [], isLoading: false });

      // Tính tổng số trang
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
    } catch (error) {
      console.error("Lỗi khi gọi API bài viết yêu thích:", error);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchFavouritePosts();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      setCurrentPage(page);
    }
  };

  return (
    <section className="shop spad">
      <div className="container">
        <div className="row">
          {/* Danh sách sản phẩm */}
          <div className="col-lg-9">
            <div className="row">
              <div className="col-lg-6">
                <p className="!text-xl !font-bold !text-blue-400 text-uppercase !m-0">
                  Danh sách bài viết yêu thích
                </p>
              </div>
            </div>

            <div className="column">
              {data.sanpham.length > 0 ? (
                data.sanpham
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((i) => <ItemProduct key={i._id} sanpham={i} favouritePosts={data.sanpham} />
                )
              ) : (
                <div className="text-center justify-between items-center p-12">
                  <h5 className="!text-lg !text-red-500">Không có bài đăng nào yêu thích!</h5>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination mt-4 text-center items-center flex justify-center">
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Favourite;
