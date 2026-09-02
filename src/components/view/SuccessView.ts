import {Component} from '../base/Component'
import {ISuccessView} from '../../types'

export class SuccessView extends Component<ISuccessView> {
  private descriptionElement: HTMLElement
  private closeButton: HTMLButtonElement

  constructor(container: HTMLElement, onClose: () => void) {
    super(container)
    this.descriptionElement = container.querySelector('.order-success__description')!
    this.closeButton = container.querySelector('.order-success__close')!

    this.closeButton.addEventListener('click', onClose)
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов!`
  }
}