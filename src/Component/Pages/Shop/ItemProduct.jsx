import { useDispatch, useSelector } from "react-redux";
import '../../../tailwind.css';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';  // Import ngôn ngữ tiếng Việt
import { useEffect, useState } from "react";
import axios from "axios";

// Kích hoạt các plugin cần thiết
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime)
dayjs.locale('vi');  // Sử dụng ngôn ngữ tiếng Việt\
// Cấu hình relativeTime để hiển thị số thay vì chữ
const customRelativeTime = {
  future: 'trong %s',
  past: '%s trước',
  s: 'vài giây',
  m: '1 phút',
  mm: '%d phút',
  h: '1 giờ',
  hh: '%d giờ',
  d: '1 ngày',
  dd: '%d ngày',
  M: '1 tháng',
  MM: '%d tháng',
  y: '1 năm',
  yy: '%d năm',
};

dayjs.locale({
  ...dayjs.Ls.vi,
  relativeTime: customRelativeTime,
});


function ItemProduct({ sanpham, favouritePosts }) {
  const dispatch = useDispatch();
  const loginStatus = useSelector((state) => state.user.login);

  const vietnamTime = dayjs.utc(sanpham.createdAt).tz('Asia/Ho_Chi_Minh');
  const timeAgo = vietnamTime.fromNow();



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

  const [liked, setLiked] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null; 

  useEffect(() => {
    if (favouritePosts?.some((fav) => fav._id === sanpham._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [favouritePosts, sanpham]);

  const handleFavouriteClick = async () => {
    if (!loginStatus || !userId) {
      alert("Vui lòng đăng nhập để lưu bài viết!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/favourites", {
        userId,
        postId: sanpham._id,
      });

      setLiked(response.data.isFavourite);
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
    }
  };


  return (
    <div className="mt-6">
      <div className="flex border border-gray-300 rounded-lg bg-white p-3 hover:shadow-lg transition-shadow ">
        {/* Hình ảnh */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <Link to={`/product-detail/${sanpham._id}`}>
            <img
              src={sanpham.images[0]}
              alt={sanpham.title}
              className="w-full h-full object-cover rounded-md"
            />
          </Link>

          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
            <i className="fas fa-camera mr-1"></i> {sanpham.images?.length || 0}
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col justify-between flex-1 ml-4">
          {/* Tiêu đề */}
          {/* Tiêu đề và icon trái tim */}
          <div className="flex justify-between items-center">
            <h5 className="font-bold text-blue-400 text-left !font-bold">
              {sanpham.title.length > 55 ? `${sanpham.title.slice(0, 55)}...` : sanpham.title}
            </h5>
            {/* Icon trái tim */}
            {/* <button className="text-right" onClick={handleFavouriteClick}>
              <i className={`fa-heart text-lg ${liked ? "fa-solid text-red-500" : "fa-regular text-gray-500"}`}></i>
            </button> */}
          </div>



          <div className="text-gray-500  text-left text-base">
            <span>{sanpham.address?.street || ''}, {sanpham.address?.ward || ''}, {sanpham.address?.district || ''}, {sanpham.address?.city || ''}</span>
          </div>

          {/* Chi tiết phòng */}
          <div className="text-base text-gray-500 mt-1 text-left ">
            <span>Diện tích: {sanpham.roomarea} m²</span> ·{" "}

          </div>
          <div className="text-base text-gray-500 mt-1 text-left ">

            <span>Còn trống: {sanpham.roomnull} phòng</span>
          </div>
          {/* Giá và ngày */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-red-600 font-bold text-base">
              {formatPrice(sanpham.price)}
            </span>
            {/* Hiển thị tên và số điện thoại đã định dạng */}
            <span className="text-gray-400  text-left text-base">{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );

}

export default ItemProduct;
