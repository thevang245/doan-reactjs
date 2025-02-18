import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ItemProduct from "../Shop/ItemProduct";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';  // Import ngôn ngữ tiếng Việt
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ItemSameArea from "../Shop/Itemsamearea";



// Kích hoạt các plugin cần thiết
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime)
dayjs.locale('vi');  // Sử dụng ngôn ngữ tiếng Việt

// Tạo icon tùy chỉnh cho marker trên bản đồ
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});



function ShopDetail() {
  const location = useLocation(); // Lấy state từ Link
  const { id } = useParams();
  const [data, setData] = useState({ sanpham: {}, isLoading: false });
  const loginStatus = useSelector((state) => state.user.login); // Lấy trạng thái đăng nhập từ Redux store
  const [data2, setData2] = useState({ product: [], isLoading: false });
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  const images = data.sanpham.images || [];

  // Khai báo state cho selectedImage và currentIndex
  const [selectedImage, setSelectedImage] = useState(images[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm chuyển đến ảnh trước
  const handlePrevImage = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Hàm chuyển đến ảnh tiếp theo
  const handleNextImage = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Hàm chọn ảnh thu nhỏ
  const handleThumbnailClick = (image) => {
    const index = images.indexOf(image);
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Hàm chuyển đổi giá trị thành dạng "triệu"
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + ' triệu/tháng';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1) + ' nghìn/tháng';
    }
    return price + ' VNĐ';
  };

  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
  };

  const getCoordinates = async (address) => {
    const formattedAddress = `${address.street.trim()}, ${address.ward.trim()}, ${address.district.trim()}, ${address.city.trim()}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json`;

    try {
      const response = await axios.get(url);
      console.log("API response:", response.data);  // Xem chi tiết phản hồi từ API

      if (response.data && response.data.length > 0) {
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon),
        };
      } else {
        console.error("Không tìm thấy tọa độ cho địa chỉ:", formattedAddress);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
    return { latitude: 10.8231, longitude: 106.6297 };
  };







  // Lấy chi tiết sản phẩm từ API theo ID
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`); // API lấy chi tiết bài đăng
        setData({ sanpham: response.data, isLoading: true });
        const { address } = response.data;
      if (address && address.street && address.ward && address.district && address.city) {
        const coordinates = await getCoordinates(address); // Lấy tọa độ từ địa chỉ
        setCoordinates(coordinates); // Cập nhật tọa độ vào state
      }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };

    fetchProductDetail();
  }, [id]); // Chỉ chạy khi `id` thay đổi


  ///// useEffect san pham
  // Lọc các sản phẩm cùng thành phố
  useEffect(() => {
    if (data.sanpham.address && data.sanpham.address.city && data.sanpham.address.district) {
      const { city, district } = data.sanpham.address;
      const currentProductId = data.sanpham._id; // Giả sử sản phẩm hiện tại có id là data.sanpham.id
  
      // Loại bỏ khoảng trống thừa trước và sau tên thành phố và quận
      const cityTrimmed = city.trim().toLowerCase();
      const districtTrimmed = district.trim().toLowerCase();
  
      // Loại bỏ từ "quận" trong tên quận, nếu có
      const districtWithoutQuan = districtTrimmed.replace(/quận\s*/g, '').trim();
  
      // Loại bỏ từ "thành phố" trong tên thành phố, nếu có
      const cityWithoutThanhPho = cityTrimmed.replace(/thành\s*phố\s*/g, '').trim();
  
      // Gọi API để lấy danh sách các bài đăng
      axios.get('http://localhost:5000/api/posts')
        .then(kQ => {
          if (kQ.data && Array.isArray(kQ.data.posts)) {
            const filteredProducts = kQ.data.posts.filter(product => {
              // Lấy thông tin thành phố và quận từ mỗi bài đăng
              const productCityTrimmed = product.address.city.trim().toLowerCase();
              const productDistrictTrimmed = product.address.district.trim().toLowerCase();
  
              // Loại bỏ từ "quận" trong tên quận của mỗi bài đăng, nếu có
              const productDistrictWithoutQuan = productDistrictTrimmed.replace(/quận\s*/g, '').trim();
  
              // Loại bỏ từ "thành phố" trong tên thành phố của mỗi bài đăng, nếu có
              const productCityWithoutThanhPho = productCityTrimmed.replace(/thành\s*phố\s*/g, '').trim();
  
              // Kiểm tra nếu thành phố và quận của bài đăng có chứa thành phố và quận của sản phẩm hiện tại
              const cityMatch = productCityWithoutThanhPho.includes(cityWithoutThanhPho);
              const districtMatch = productDistrictWithoutQuan.includes(districtWithoutQuan);
  
              // Trả về các bài đăng có thành phố và quận khớp và loại trừ sản phẩm hiện tại
              return cityMatch && districtMatch && product._id !== currentProductId;
            }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp bài mới nhất trước
            .slice(0, 3); // Lấy 3 bài mới nhất;
            
            setData2({ product: filteredProducts, isLoading: false });
          } else {
            console.error("Không có bài đăng hoặc dữ liệu không đúng định dạng");
          }
        })
        .catch(e => console.error(e));
    }
  }, [data.sanpham.address]); // Chạy lại khi địa chỉ thay đổi
  
  
  
  
  
  
  
  
  
  




  useEffect(() => {
    // Nếu có dữ liệu sản phẩm và ảnh, chọn ảnh đầu tiên
    if (data.sanpham.images && data.sanpham.images.length > 0) {
      setSelectedImage(data.sanpham.images[0]);
    }
  }, [data.sanpham.images]); // Chạy lại khi images thay đổi


  const vietnamTime = dayjs.utc(data.sanpham.createdAt).tz('Asia/Ho_Chi_Minh');
  const timeAgo = vietnamTime.fromNow();

  const { latitude, longitude } = data.sanpham.address || {};



  return (<>


    <div className="container mx-auto py-8">
      {/* Product Breadcrumb */}
      <div className="flex mb-8 justify-center">
        <a href="./index.html" className="text-gray-600 hover:text-gray-900">Home</a>
        <span className="mx-2">/</span>
        <a href="./shop.html" className="text-gray-600 hover:text-gray-900">Shop</a>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Product Details</span>
      </div>

      <div className="flex flex-wrap justify-center">
        {/* Product Main Image */}
        <div className="w-full lg:w-3/4 relative flex justify-center items-center mb-6 lg:mb-0">
          <div className="w-full max-w-4xl relative">
            {selectedImage ? (
              <img
                className="w-full h-96 object-contain bg-black rounded-lg shadow-lg"
                src={selectedImage}
                alt="Product Detail"
              />
            ) : (
              <div className="text-center">Ảnh sản phẩm không có sẵn</div>
            )}

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black p-2 rounded-full shadow-md hover:bg-gray-700 z-10"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="lg" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black p-2 rounded-full shadow-md hover:bg-gray-700 z-10"
            >
              <FontAwesomeIcon icon={faChevronRight} size="lg" />
            </button>

            {/* Image Index (Current Image / Total Images) */}
            <div
              className="bg-blend-darken absolute bottom-4 rounded-lg left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu đen với độ trong suốt 50%
                padding: '5px', // Thêm padding nếu cần
              }}
            >
              {`${currentIndex + 1} / ${images.length}`}
            </div>
          </div>
        </div>

        {/* Product Thumbnails */}
        <div className="w-full lg:w-3/4 mt-4 flex justify-center">
          <div className="flex flex-row justify-center space-x-4">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="flex justify-center">
                  <img
                    className={`w-15 h-15 object-cover cursor-pointer hover:opacity-75 rounded-lg shadow-md ${selectedImage === image ? 'border-4 border-red-500' : ''
                      }`}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handleThumbnailClick(image)} // Sử dụng onClick thay vì onChange
                  />
                </div>
              ))
            ) : (
              <div className="text-center">Ảnh sản phẩm không có sẵn</div>
            )}
          </div>
        </div>
      </div>


    </div>



    <div className="container mx-auto p-6">
      <div className="w-full lg:w-3/4 mx-auto border rounded-xl  bg-white">
        <div className="p-4 text-left">
          <h4
            className="text-base text-red-600"
            style={{ fontWeight: "bold" }}
          >
            {data.sanpham.title}
          </h4>
          <h5 className="!text-base">Địa chỉ: {data.sanpham.address?.street || ''},{data.sanpham.address?.ward || ''},{data.sanpham.address?.district || ''},{data.sanpham.address?.city || ''}</h5>

          <div className="mt-2 text-gray-700">
            <p className="!text-lg">
              <span className="font-bold text-green-600 !text-lg">Giá: {formatPrice(data.sanpham.price)}</span>
            </p>
            <p className="!text-base !text-gray-500">Diện tích: {data.sanpham.roomarea} m²</p>
            <p className="!text-base !text-gray-500">Còn trống: {data.sanpham.roomnull} phòng</p>
            <p className="!text-base !text-blue-500">
              Đã đăng: {timeAgo}
            </p>
          </div>
          <div className="mt-4 border-t pt-4 text-gray-300">
            <h5 className=" text-gray-600 !font-bold">Thông tin mô tả</h5>
            <ul className="list-disc ml-6 text-sm mt-2">
              <p className="whitespace-pre-line text-left">
                {data.sanpham.description}
              </p>
            </ul>
          </div>

          <div className="mt-4 border-t pt-4 text-gray-300  text-left">
            <h5 className="!font-bold pb-8 text-gray-600">Tiện ích</h5>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
              {data.sanpham.utilities && Array.isArray(data.sanpham.utilities) && data.sanpham.utilities.length > 0 ? (
                data.sanpham.utilities.map((utility, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">&#x2714;</span>
                    <span>{utility}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Không có tiện ích</div>
              )}
            </div>
          </div>
          {/* 📍 Hiển thị Bản Đồ */}
          {coordinates.latitude && coordinates.longitude ? (
            <div className="mt-6 border-t pt-4 text-left text-gray-300">
              <h5 className="!font-bold text-gray-600">Vị trí trên bản đồ</h5>
              <div className="w-full h-80 mt-4 rounded-lg overflow-hidden">
                <MapContainer
                  center={[coordinates.latitude, coordinates.longitude]}
                  zoom={15}
                  className="w-full h-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[coordinates.latitude, coordinates.longitude]}>
                    <Popup>{data.sanpham.address || "Vị trí sản phẩm"}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Không có thông tin vị trí</p>
          )}



          <div className="mt-4 border-t pt-4 text-left text-gray-300">
            <h5 className="!font-bold text-gray-600" >Liên hệ</h5>
            <p className="text-sm text-gray-800">
              Call/Mes/Zalo: <span className="font-semibold">{formatPhone(data.sanpham.contactPhone)}</span> ({data.sanpham.contactName})
            </p>
          </div>

          <div className="mt-6 text-center">
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </div>
    </div>




    {/* Shop Details Section End */}
    {/* Related Section Begin */}
    <section className="related spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h3 className="related-title !m-0 !text-blue-400">Các bài đăng cùng khu vực</h3>
          </div>
        </div>
        <div className="row">
          {data2.product.length > 0 ? (
            data2.product.map(i => <ItemSameArea key={i.id} product={i} />)
          ) : (
            <p className="text-center text-gray-500">Không có sản phẩm cùng thành phố</p>
          )}
        </div>
      </div>
    </section>

    {/* Related Section End */}
  </>
  );
}

export default ShopDetail;