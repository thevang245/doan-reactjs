import axios from "axios";
import { useEffect, useState } from "react";
import ReactOwlCarousel from 'react-owl-carousel';
import ItemProduct from "../Shop/ItemProduct";
import { useNavigate } from "react-router-dom";
import ItemSameArea from "../Shop/Itemsamearea";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState({ product: [], isLoading: true });

  useEffect(() => {
    // Cuộn lên đầu trang khi component được mount
    window.scrollTo(0, 0);
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    // Thiết lập nền từ `data-setbg`
    document.querySelectorAll('.set-bg').forEach((item) => {
      const bg = item.getAttribute('data-setbg');
      item.style.backgroundImage = `url(${bg})`;
    });
  }, []);

  // Fetch dữ liệu bài đăng
  useEffect(() => {
    // Lấy dữ liệu từ API, có thể bạn cần chỉnh sửa URL nếu cần lọc theo loại bài đăng mới nhất
    axios
      .get('http://localhost:5000/api/posts', {
        params: {
          sortBy: 'createdAt', // Giả sử API hỗ trợ sắp xếp theo thời gian tạo
          order: 'desc',       // Giảm dần để lấy bài mới nhất
          limit: 6             // Giới hạn số lượng bài đăng lấy về (tùy ý)
        }
      })
      .then((response) => {
        setData({ product: response.data.posts, isLoading: false });
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
        setData({ product: [], isLoading: false });
      });
  }, []);

  return (
    <>
      <div className="mb-10">
        <div className="m-10 border-white">
          <ReactOwlCarousel
            className="hero__slider owl-carousel"
            items={1}
            loop
            margin={10}
            nav
            dots
            autoplayTimeout={100000}
          >
            {[{ title: "Căn hộ chung cư", image: "img/hero/chungcu.jpg", desc: "Chúng tôi sẽ giúp bạn tìm kiếm căn hộ chung cư lý tưởng với không gian sống hoàn hảo, đầy đủ tiện nghi và vị trí thuận lợi." },
            { title: "Nhà nguyên căn", image: "img/hero/nhao.jpg", desc: "Chúng tôi giúp bạn tìm nhà nguyên căn phù hợp với nhu cầu, vị trí và mức giá mong muốn. Hãy để chúng tôi hỗ trợ bạn tìm tổ ấm lý tưởng!" },
            { title: "Phòng trọ", image: "img/hero/phongtro.jpg", desc: "Chúng tôi giúp bạn tìm phòng trọ giá rẻ, tiện nghi, phù hợp với nhu cầu sống của bạn." }
            ].map((item, index) => (
              <div key={index} className="relative hero__items set-bg " data-setbg={item.image}>
                <div className="absolute inset-0 bg-black opacity-50 "></div>
                <div className="container relative z-20">
                  <div className="row">
                    <div className="col-xl-5 col-lg-8 col-md-8">
                      <div className="hero__text text-white p-8">
                        <h2 className="text-white">{item.title}</h2>
                        <p className="!text-lg">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ReactOwlCarousel>
        </div>

        <section className="container mx-auto my-10">
          <ul className="filter__controls">
            <li className="active" data-filter="*">Gợi ý khu vực</li>
          </ul>
          <div className="grid grid-cols-3 gap-6">
            {[{ title: "Thành phố Hồ Chí Minh", image: "img/location/imghochiminh.png" },
            { title: "Thành phố Đà Nẵng", image: "img/location/imgdanang.png" },
            { title: "Thành phố Cần Thơ", image: "img/location/imgcantho.jpg" }
            ].map((item, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => navigate(`/search?city=${encodeURIComponent(item.title)}`)}>
                <img src={item.image} alt={item.title} className="w-[500] h-60 object-cover" />
                <div className="absolute bottom-4 left-4 text-white text-lg font-bold bg-black/50 px-3 py-1 rounded-md">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="product spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="filter__controls">
                  <li className="active" data-filter="*">Bài đăng mới nhất</li>
                </ul>
              </div>
            </div>
            <div className="row product__filter">
              {data.isLoading ? (
                <div>Loading...</div>
              ) : (
                data.product.map(i => <ItemSameArea key={i.id} product={i} />)
              )}
            </div>
          </div>
        </section>
        <section className="support-section bg-white py-10 product border rounded-2xl max-w-[1150px] mx-auto">
          <div className="container flex items-center justify-between px-6">
            <div className="w-1/2">
              <img src="img/cskh.jpg" alt="Hỗ trợ" className="w-full h-auto rounded-lg" />
            </div>
            <div className="w-1/2 text-center">
              <h2 className="text-2xl font-bold mb-4">Hỗ trợ đăng bài</h2>
              <p className="mb-6 text-gray-600">
                Nếu bạn cần hỗ trợ đăng bài, vui lòng liên hệ số điện thoại bên dưới:
              </p>
              <div className="flex flex-col space-y-3">
                <a href="tel:0909316890" className="!bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 rounded-3xl flex items-center justify-center text-lg shadow-md">
                  <i className="fa-solid fa-phone-volume pr-2"></i> ĐT: 0999999999
                </a>
                <a href="https://zalo.me/0909316890" className="!bg-sky-500 hover:bg-sky-600 text-white py-3 px-6 rounded-3xl flex items-center justify-center text-lg shadow-md">
                  <i className="fa-regular fa-comment-dots pr-2"></i> Zalo: 0999999999
                </a>
              </div>
            </div>
          </div>
        </section>


      </div>
    </>
  );
}

export default Home;
