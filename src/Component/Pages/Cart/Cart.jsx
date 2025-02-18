import { useSelector } from "react-redux";
import ItemCart from "./ItemCart.jsx";

function Cart() {
    const cart = useSelector((state) => state.cart)
    return ( <>
        {/* Breadcrumb Section Begin */}
        <section className="breadcrumb-option">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb__text">
                  <h4>Shopping Cart</h4>
                  <div className="breadcrumb__links">
                    <a href="./index.html">Home</a>
                    <a href="./shop.html">Shop</a>
                    <span>Shopping Cart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Breadcrumb Section End */}
        {/* Shopping Cart Section Begin */}
        <section className="shopping-cart spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="shopping__cart__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      
                      {cart.items.map( i => <ItemCart key={i.id} data={i}/>)}
                     
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="continue__btn">
                      <a href="#">Continue Shopping</a>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="continue__btn update__btn">
                      <a href="#">
                        <i className="fa fa-spinner" /> Update cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="cart__discount">
                  <h6>Discount codes</h6>
                  <form action="#">
                    <input type="text" placeholder="Coupon code" />
                    <button type="submit">Apply</button>
                  </form>
                </div>
                <div className="cart__total">
                  <h6>Cart total</h6>
                  <ul>
                    <li>
                      Subtotal <span>$ 169.50</span>
                    </li>
                    <li>
                      Total <span>${cart.total}</span>
                    </li>
                  </ul>
                  <a href="#" className="primary-btn">
                    Proceed to checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Shopping Cart Section End */}
      </>
       );
}

export default Cart;