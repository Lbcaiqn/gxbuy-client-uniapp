import request from "../config";
import type {
  GetOrderDataRequestParameter,
  GetConfirmOrderDataRequestParameter,
  CreateOrderByIdRequestParameter
} from "@/types";

export function getOrderDataRequest(parameter: GetOrderDataRequestParameter) {
  return request({
    url: "/order/jwt/getOrderData",
    data: parameter
  });
}

export function getConfirmOrderDataRequest(parameter: GetConfirmOrderDataRequestParameter) {
  return request({
    url: "/order/jwt/getConfirmOrderData",
    data: parameter
  });
}

export function createOrderByIdRequest(parameter: CreateOrderByIdRequestParameter) {
  return request({
    url: "/order/jwt/createOrderById",
    method: "post",
    data: parameter
  });
}

export function createOrderByShopcartRequest(shopcartIds: Array<string>) {
  return request({
    url: "/order/jwt/createOrderByShopcart",
    method: "post",
    data: {
      shopcartIds
    }
  });
}

export function getPayInfoRequest(orderIds: Array<string>) {
  return request({
    url: "/order/jwt/getPayInfo",
    data: {
      orderIds
    }
  });
}

export function getPayStateRequest(orderIds: Array<string>) {
  return request({
    url: "/order/getPayState",
    data: {
      orderIds
    }
  });
}

export function completePayRequest(orderIds: Array<string>) {
  return request({
    url: "/order/completePay",
    method: "patch",
    data: {
      orderIds
    }
  });
}

export function cancelOrderRequest(orderIds: Array<string>) {
  return request({
    url: "/order/jwt/cancelOrder",
    method: "patch",
    data: {
      orderIds
    }
  });
}
