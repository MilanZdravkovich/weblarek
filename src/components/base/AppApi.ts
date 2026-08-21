import {IApi, IProductsResponse, IOrderRequest, IOrderResponse} from "../../types/index.ts"

export class AppApi {
  private _api: IApi

  constructor(api: IApi) {
    this._api = api
  }

  getProducts(): Promise<IProductsResponse> {
    return this._api.get<IProductsResponse>('/product/')
  }

  makeOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this._api.post<IOrderResponse>('/order', data)
  }
}