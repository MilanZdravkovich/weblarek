export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash'

export interface IProduct {
    id: string
    description: string
    image: string
    title: string
    category: string
    price: number | null
}

export interface IBuyer {
    payment: TPayment | null
    email: string
    phone: string
    address: string
}

export interface IProductsResponse {
    total: number
    items: IProduct[]
}

export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string
    total: number
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>

export interface ICardCatalog {
    category: string,
    title: string,
    image: string,
    price: number | null;
}

export interface ICardPreview {
    category: string,
    title: string,
    description: string,
    image: string,
    price: number | null,
    isInBasket: boolean;
}

export interface ICardBasket {
    index: number,
    title: string,
    price: number | null;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IOrderForm {
    payment: TPayment | null,
    address: string,
    errors: TValidationErrors;
}

export interface IContactsForm {
    email: string,
    phone: string,
    errors: TValidationErrors;
}

export interface ISuccessView {
    total: number;
}