import {Component} from '../base/Component'

interface IModalData {
  content: HTMLElement
}

export class Modal extends Component<IModalData> {
  private closeButton: HTMLButtonElement

  constructor(container: HTMLElement) {
    super(container)
    this.closeButton = container.querySelector('.modal__close')!
    this.closeButton.addEventListener('click', () => this.close())
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close()
      }
    })
  }

  set content(value: HTMLElement) {
    const contentContainer = this.container.querySelector('.modal__content')!
    contentContainer.replaceChildren(value)
  }

  open(): void {
    this.container.classList.add('modal_active')
  }

  close(): void {
    this.container.classList.remove('modal_active')
  }

  render(data?: Partial<IModalData>): HTMLElement {
    super.render(data)
    this.open()
    return this.container 
  }
}