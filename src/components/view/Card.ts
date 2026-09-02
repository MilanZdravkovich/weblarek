import {Component} from '../base/Component'

interface ICardData {
  title: string,
  price: number | null
}

export abstract class Card<T extends ICardData> extends Component<T> {
  protected titleElement: HTMLHeadingElement
  protected priceElement: HTMLParagraphElement

  constructor(container: HTMLElement) {
    super(container)
    this.titleElement = container.querySelector('.card__title')!
    this.priceElement = container.querySelector('.card__price')!
  }

  set title(value: string) {
    this.titleElement.textContent = value
  }

  set price(value: number | null) {
    this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Недоступно'
  }
}