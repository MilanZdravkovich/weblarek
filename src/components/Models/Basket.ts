import {IProduct} from "../../types/index.ts"
import {IEvents} from "../base/Events"

export class Basket {
  private items: IProduct[] = []

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return this.items
  }

  addItem(product: IProduct): void {
    this.items.push(product)
    this.events.emit('basket:changed', {items: this.items})
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id)
    this.events.emit('basket:changed', {items: this.items})
  }

  clear(): void {
    this.items = []
    this.events.emit('basket:changed', {items: this.items})
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0)
  }

  getCount(): number {
    return this.items.length
  }

  contains(id: string): boolean {
    return this.items.some(item => item.id === id)
  }
}