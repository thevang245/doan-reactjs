import { autoBatchEnhancer } from "@reduxjs/toolkit";
import {addUpdateProduct,removeProduct} from "../../Reducer/cartSlice"
import { useDispatch } from "react-redux";


function ItemCart({data}) {
    const dispatch = useDispatch();
    let xoaProduct = (event) => {
        event.preventDefault();
        dispatch(removeProduct({id: data.id}));
    }

    let updateQuantity = (event) => {
        event.preventDefault();
        let soHientai = event.target.value;
        dispatch(addUpdateProduct({id: data.id,price: data.price, quantity: soHientai})); 
        console.log(data.totalItem)
    }
 
    return (
        <>
            <tr>
                <td className="product__cart__item">
                    <div className="product__cart__item__pic">
                        <img src={data.image} width={200} height={170} alt="" />
                    </div>
                    <div className="product__cart__item__text">
                        <h6>{data.title}</h6>
                        <h5>{data.price}</h5>
                    </div>
                </td>
                <td className="quantity__item">
                    <div className="quantity">
                        <div className="pro-qty-2">
                            <input type="number" defaultValue={data.quantity} onChange={updateQuantity} />
                        </div>
                    </div>
                </td>
                <td className="cart__price">{data.totalItem}</td>
                <td className="cart__close" onClick={xoaProduct}>
                    <i className="fa fa-close" />
                </td>
            </tr></>
    );
}

export default ItemCart;