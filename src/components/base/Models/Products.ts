import {IProduct} from "../../../types/index.ts"

export class Products {
  private _items: IProduct[] = []
  private _selected: IProduct | null = null

  setItems(items: IProduct[]): void {
    this._items = items
  }

  getItems(): IProduct[] {
    return this._items
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id)
  }

  setSelected(product: IProduct): void {
    this._selected = product
  }

  getSelected(): IProduct | null {
    return this._selected
  }
}