import {Card} from './Card'
import {ICardPreview} from '../../types'
import {categoryMap} from '../../utils/constants'

export class CardPreview extends Card<ICardPreview> {
  private categoryElement: HTMLElement
  private imageElement: HTMLImageElement
  private descriptionElement: HTMLElement
  private buttonElement: HTMLButtonElement

  constructor(container: HTMLElement, onButtonClicked: (id: string) => void) {
    super(container)
    this.categoryElement = container.querySelector('.card__category')!
    this.imageElement = container.querySelector('.card__image')!
    this.descriptionElement = container.querySelector('.card__text')!
    this.buttonElement = container.querySelector('.card__button')!

    this.buttonElement.addEventListener('click', () => onButtonClicked(this.id))
  }

  private id: string = ''

  set itemId(value: string) {
    this.id = value
  }

  set category(value: string) {
    this.categoryElement.textContent = value
    const modifier = categoryMap[value as keyof typeof categoryMap]
    if (modifier) {
      this.categoryElement.className = `card__category ${modifier}`
    }
  }

  set image(value: string) {
    this.imageElement.src = value
  }

  set description(value: string) {
    this.descriptionElement.textContent = value
  }

  set isInBasket(value: boolean) {
    this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину'
    if (this.price === null) {
      this.buttonElement.disabled = true
      this.buttonElement.textContent = 'Недоступно'
    }
  }
}