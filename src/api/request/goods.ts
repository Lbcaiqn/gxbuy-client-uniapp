import request from "../config";
import type {
  GetSearchRequestParameter,
  GetGoodsByShopRequestParameter,
  GetGoodsCommentRequestParameter
} from "@/types";

export function getSearchRequest(parameter: GetSearchRequestParameter) {
  return request({
    url: "/goods/search",
    data: parameter
  });
}

export function getGoodsByShopRequest(id: string, parameter: GetGoodsByShopRequestParameter) {
  return request({
    url: "/goods/getGoodsByShop/" + id,
    data: parameter
  });
}

export function getGoodsDetailDataRequest(id: string) {
  return request({
    url: "/goods/detail/" + id
  });
}

export function getGoodsCommentRequest(id: string, parameter: GetGoodsCommentRequestParameter) {
  return request({
    url: "/goods/getGoodsComment/" + id,
    data: parameter
  });
}
