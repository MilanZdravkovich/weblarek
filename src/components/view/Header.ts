import {Component} from '../base/Component'

interface IHeaderData {
  count: number
}

export class Header extends Component<IHeaderData> {
  private basketButton: HTMLButtonElement
  private basketCounter: HTMLSpanElement

  constructor(container: HTMLElement, onBasketClick: () => void) {
    super(container)
    this.basketButton = container.querySelector('.header__basket')!
    this.basketCounter = container.querySelector('.header__basket-counter')!

    this.basketButton.addEventListener('click', onBasketClick)
  }

  set count(value: number) {
    this.basketCounter.textContent = String(value)
  }
}