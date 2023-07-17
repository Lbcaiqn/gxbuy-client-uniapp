import request from "../config";
import type { UserLoginRequestParameter, UserRegisterRequestParameter, GetUserRecordRequestParameter } from "@/types";

export function userRegisterRequest(parameter: UserRegisterRequestParameter) {
  return request({
    url: "/user/register",
    method: "post",
    data: parameter,
    withCredentials: true
  });
}

export function userLoginRequest(parameter: UserLoginRequestParameter) {
  return request({
    url: "/user/login",
    method: "post",
    data: parameter,
    withCredentials: true
  });
}

export function getUserInfoRequest() {
  return request({
    url: "/user/jwt/getUserInfo"
  });
}

export function getUserAddressRequest() {
  return request({
    url: "/user/jwt/getUserAddress"
  });
}

export function getUserRecordRequest(parameter: GetUserRecordRequestParameter) {
  return request({
    url: "/user/jwt/getUserRecord",
    data: parameter
  });
}

export function followRequest(shop_id: string) {
  return request({
    url: "/user/jwt/follow",
    method: "post",
    data: { shop_id }
  });
}

export function favoriteRequest(goods_spu_id: string) {
  return request({
    url: "/user/jwt/favorite",
    method: "post",
    data: { goods_spu_id }
  });
}

export function deleteSearchHistorySingleRequest(hid: string) {
  return request({
    url: "/user/jwt/deleteSearchHistorySingle/" + hid,
    method: "delete"
  });
}

export function deleteSearchHistoryAllRequest() {
  return request({
    url: "/user/jwt/deleteSearchHistoryAll",
    method: "delete"
  });
}

export function deleteBrowseHistorySingleRequest(hid: string) {
  return request({
    url: "/user/jwt/deleteBrowseHistorySingle/" + hid,
    method: "delete"
  });
}

export function deleteBrowseHistoryAllRequest() {
  return request({
    url: "/user/jwt/deleteBrowseHistoryAll",
    method: "delete"
  });
}
