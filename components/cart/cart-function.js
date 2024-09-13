import React from "react";
import style from "./cart.module.scss";
import CartPoint from "./cart-function-point";
import CartData from "./cart-function-data";
import CartTotal from "./cart-function-total";
import CartButton from "./cart-button";
import Swal from "sweetalert2";
import { checkout_linepay, checkout_bluepay } from "@/hooks/call-api";
import { useAuth } from "@/hooks/auth-context";
export default function CartFunction({ order, setOrder }) {
  const { setAuth } = useAuth();
    // 轉譯JWT
    const parseJwt = (token) => {
      const base64Payload = token.split(".")[1];
      const payload = Buffer.from(base64Payload, "base64");
      return JSON.parse(payload.toString());
    };
  // 前往付款
  const handlePay = async () => {
    if (!(await checkError(order))) {
      return;
    }

    if (order.pay == 1) {
      const req = await checkout_linepay(order);
      if (req?.message === "success") {
        setAuth({
          isAuth: true,
          user: parseJwt(req.data.token),
        });
        setTimeout(()=>{
          window.location.href = req.data.web;
        },1000)
      }
    } else if (order.pay == 2) {
      const req = await checkout_bluepay(order);
      if (req?.message === "success") {
      }
    }
  };

  const checkError = async (data) => {
    if (data.books.length == 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "請勾選要購買的書籍",
      });
      return false;
    }
    if (data.pay == 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "請選擇付款方式",
      });
      return false;
    }
    return true;
  };

  return (
    <div className={style.col_cart_function}>
      <CartPoint setOrder={setOrder} />
      <CartData setOrder={setOrder} />
      <CartTotal order={order} />
      <CartButton name="確認訂單" handlePay={handlePay} />
    </div>
  );
}
