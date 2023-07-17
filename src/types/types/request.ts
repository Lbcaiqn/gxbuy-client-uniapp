export interface PageParameter {
  pageSize?: number;
  page?: number;
}

export interface GetGoodsByFeatureRequestParameter extends PageParameter {
  feature: "hot" | "new" | "pop";
}

export interface GetSearchRequestParameter extends PageParameter {
  keyword?: string;
  c1id?: number;
  c2id?: number;
  c3id?: number;
}

export interface GetGoodsByShopRequestParameter extends PageParameter {}

export interface GetGoodsCommentRequestParameter extends PageParameter {}

export interface GetOrderDataRequestParameter extends PageParameter {
  feature: "all" | "wait_paid" | "wait_shipped" | "wait_receive" | "wait_comment" | string;
}

export interface GetConfirmOrderDataRequestParameter {
  from: "goods" | "shopcart" | string;
  goodsSkuId?: string;
}

export interface CreateOrderByIdRequestParameter {
  goodsSkuId: string;
  shopId: string;
  quantity: number;
}

export interface InsertShopcartDataRequestParameter {
  goods_spu_id: string;
  goods_sku_id: string;
  shop_id: string;
  quantity?: number;
}

export interface UpdateSingleStateRequestParameter {
  command: "quantity" | "selected" | string;
  quantity?: number;
  goods_sku_id: string;
}

export interface UpdateAllSelectedRequestParameter {
  command: "all" | "shop" | string;
  selectedOrCancel: boolean;
  shop_id?: string;
}

export interface UserRegisterRequestParameter {
  user_account: string;
  user_name: string;
  user_password: string;
  code: string;
}

export interface UserLoginRequestParameter {
  user_account: string;
  user_password: string;
  code: string;
}

export interface GetUserRecordRequestParameter extends PageParameter {
  feature: "favorite" | "follow" | "buyed_shop" | "browse_history" | "search_history" | string;
}
