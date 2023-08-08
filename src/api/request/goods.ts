import request from "../config";
import type {
  GetSearchRequestParameter,
  GetGoodsByShopRequestParameter,
  GetGoodsCommentRequestParameter
} from "@/types";

export function getSearchRequest(parameter: GetSearchRequestParameter) {
  return request({
    url: "/goods/search",
    params: parameter
  });
}

export function getGoodsByShopRequest(parameter: GetGoodsByShopRequestParameter) {
  return request({
    url: "/goods/getGoodsByShop/" + parameter.shopId,
    params: {
      pageSize: parameter.pageSize,
      page: parameter.page
    }
  });
}

export function getGoodsDetailDataRequest(id: string) {
  return request({
    url: "/goods/detail/" + id
  });
}

export function getGoodsCommentRequest(parameter: GetGoodsCommentRequestParameter) {
  return request({
    url: "/goods/getGoodsComment/" + parameter.goodsSpuId,
    params: {
      pageSize: parameter.pageSize,
      page: parameter.page
    }
  });
}
