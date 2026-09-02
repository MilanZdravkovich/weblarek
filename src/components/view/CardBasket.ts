import {Card} from './Card'
import {ICardBasket} from '../../types'

export class CardBasket extends Card<ICardBasket> {
  private indexElement: HTMLElement
  private deleteButton: HTMLButtonElement

  constructor(container: HTMLElement, onDelete: (id: string) => void) {
    super(container)
    this.indexElement = container.querySelector('.basket__item-index')!
    this.deleteButton = container.querySelector('.basket__item-delete')!

    this.deleteButton.addEventListener('click', () => onDelete(this.id))
  }

  private id: string = ''

  set itemId(value: string) {
    this.id = value
  }

  set index(value: number) {
    this.indexElement.textContent = String(value)
  }
}