import request from "../config";
import type { GetGoodsByFeatureRequestParameter } from "@/types";

export function getCategoryDataRequest() {
  return request({
    url: "/category/getCategoryData"
  });
}

export function getBannerDataRequest() {
  return request({
    url: "/home/getBannerData/mobile"
  });
}

export function getRecommendDataRequest() {
  return request({
    url: "/home/getRecommendData"
  });
}

export function getGoodsByFeatureRequest(parameter: GetGoodsByFeatureRequestParameter) {
  return request({
    url: "/goods/getGoodsByFeature",
    params: parameter
  });
}

export function getFloorDataRequest() {
  return request({
    url: "/home/getFloorData"
  });
}
