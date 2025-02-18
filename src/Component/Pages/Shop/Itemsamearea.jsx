import { useDispatch, useSelector } from "react-redux";
import { addUpdateProduct } from "../../Reducer/cartSlice";
import '../../../tailwind.css';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';  // Import ngôn ngữ tiếng Việt
import { useState } from "react";

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


function ItemSameArea({ product }) {
  console.log(`iddetail: ${product._id}`)

  const vietnamTime = dayjs.utc(product.createdAt).tz('Asia/Ho_Chi_Minh');
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

  const [liked, setLiked] = useState(false);


  return (
    <div className="w-84 bg-white m-4 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Hình ảnh */}
      <div className="relative">
        <Link to={`/product-detail/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-84 h-60 object-cover"
          />
        </Link>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          <i className="fas fa-camera mr-1"></i> {product.images?.length || 0}
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-3">
        <h5 className="text-blue-500 font-medium text-sm">
          {product.title.length > 28 ? `${product.title.slice(0, 28)}...` : product.title}
        </h5>

        {/* Giá + diện tích */}
        <div className="text-green-600 font-semibold text-sm mt-1">
          {formatPrice(product.price)}{" "}
          <span className="text-gray-600">· {product.roomarea} m²</span>
        </div>

        {/* Địa chỉ */}
        <div className="text-gray-500 text-xs mt-1">
          {product.address?.district}, {product.address?.city}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-400 text-xs">{timeAgo}</span>

          {/* Nút yêu thích */}
          {/* <button onClick={() => setLiked(!liked)}>
            <i
              className={`fa-heart text-sm ${liked ? "fa-solid text-red-500" : "fa-regular text-gray-500"
                }`}
            ></i>
          </button> */}
        </div>
      </div>
    </div>
  );

};

export default ItemSameArea;
