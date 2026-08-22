import {IApi, IProductsResponse, IOrderRequest, IOrderResponse} from "../../types/index.ts"

export class AppApi {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/')
  }

  makeOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', data)
  }
}