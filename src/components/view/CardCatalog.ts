import {Card} from './Card'
import {ICardCatalog} from '../../types'
import {categoryMap} from '../../utils/constants'

export class CardCatalog extends Card<ICardCatalog> {
  private categoryElement: HTMLElement
  private imageElement: HTMLImageElement

  constructor(container: HTMLElement, onClick: () => void) {
    super(container)
    this.categoryElement = container.querySelector('.card__category')!
    this.imageElement = container.querySelector('.card__image')!

    container.addEventListener('click', onClick)
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
}