import {Card} from './Card'
import {ICardPreview} from '../../types'
import {categoryMap} from '../../utils/constants'

export class CardPreview extends Card<ICardPreview> {
  private categoryElement: HTMLElement
  private imageElement: HTMLImageElement
  private descriptionElement: HTMLElement
  private buttonElement: HTMLButtonElement

  constructor(container: HTMLElement, onButtonClick: () => void) {
    super(container)
    this.categoryElement = container.querySelector('.card__category')!
    this.imageElement = container.querySelector('.card__image')!
    this.descriptionElement = container.querySelector('.card__text')!
    this.buttonElement = container.querySelector('.card__button')!

    this.buttonElement.addEventListener('click', onButtonClick)
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

  set buttonText(value: string) {
    this.buttonElement.textContent = value
  }

  set isDisabled(value: boolean) {
    this.buttonElement.disabled = value
  }
}