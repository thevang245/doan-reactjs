import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      {/* Footer Section Begin */}
      <footer className="footer !bg-gradient-to-r from-blue-500 to-sky-400 text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer__about">
                <div className="header__logo w-full">
                  <Link to="/">
                    <h3 className="!text-white">TimtroOnline</h3>
                  </Link>
                </div>
                <a href="#">
                  <img src="img/payment.png" alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
              <div className="footer__widget">
                <h6 className="text-white">Giới thiệu</h6>
                <ul>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Quy chế hoạt động</a>
                  </li>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Chính sách bảo mật</a>
                  </li>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Quy định sử dụng</a>
                  </li>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Liên hệ</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="footer__widget">
                <h6 className="text-white">Hỗ trợ</h6>
                <ul>
                  <li>
                    <a href="#" className="!text-white !hover:text-blue-300">Bảng giá dịch vụ</a>
                  </li>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Hướng dẫn đăng tin</a>
                  </li>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Quy định đăng tin</a>
                  </li>
                  <li>
                    <a href="#" className="!text-white hover:text-blue-300">Tin tức</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
              <div className="footer__widget">
                <h6 className="text-white">Theo dõi chúng tôi</h6>
                <div className="flex space-x-4 mt-3">
                  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                    <i className="fab fa-youtube fa-2x !text-white"></i>
                  </a>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                    <i className="fab fa-facebook fa-2x !text-white"></i>
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                    <i className="fab fa-instagram fa-2x !text-white"></i>
                  </a>
                  <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                    <i className="fab fa-tiktok fa-2x !text-white"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="footer__copyright__text">
                <p className="!text-white">
                  Copyright © 2025 TimTroOnline
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Footer Section End */}
    </>
  );
  




}

export default Footer;