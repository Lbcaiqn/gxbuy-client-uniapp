import request from "../config";
import type {
  InsertShopcartDataRequestParameter,
  UpdateSingleStateRequestParameter,
  UpdateAllSelectedRequestParameter
} from "@/types";

export function insertShopcartDataRequest(parameter: InsertShopcartDataRequestParameter) {
  return request({
    url: "/shopcart/jwt/insert",
    method: "post",
    data: parameter
  });
}

export function getShopcartDataRequest() {
  return request({
    url: "/shopcart/jwt/getShopcartData"
  });
}

export function updateSingleStateRequest(parameter: UpdateSingleStateRequestParameter) {
  return request({
    url: "/shopcart/jwt/updateSingleState",
    method: "patch",
    data: parameter
  });
}

export function updateAllSelectedRequest(parameter: UpdateAllSelectedRequestParameter) {
  return request({
    url: "/shopcart/jwt/updateAllSelected",
    method: "patch",
    data: parameter
  });
}

export function deleteSingleRequest(goods_sku_id: string) {
  return request({
    url: "/shopcart/jwt/deleteSingle/" + goods_sku_id,
    method: "delete"
  });
}

export function deleteAllRequest() {
  return request({
    url: "/shopcart/jwt/deleteAll",
    method: "delete"
  });
}
