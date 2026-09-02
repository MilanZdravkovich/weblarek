import {Component} from '../base/Component'
import {IBasketView} from '../../types'

export class BasketView extends Component<IBasketView> {
  private listElement: HTMLElement
  private totalElement: HTMLElement
  private buttonElement: HTMLButtonElement

  constructor(container: HTMLElement, onOrder: () => void) {
    super(container)
    this.listElement = container.querySelector('.basket__list')!
    this.totalElement = container.querySelector('.basket__price')!
    this.buttonElement = container.querySelector('.basket__button')!

    this.buttonElement.addEventListener('click', onOrder)
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.listElement.innerHTML = '<li class="basket__empty">Корзина пуста</li>'
    } else {
      this.listElement.replaceChildren(...items)
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`
  }

  set isDisabled(value: boolean) {
    this.buttonElement.disabled = value
  }
}