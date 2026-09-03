import {Form} from './Form'
import {IOrderForm} from '../../types'

export class OrderForm extends Form<IOrderForm> {
  private paymentButtons: NodeListOf<HTMLButtonElement>
  private addressInput: HTMLInputElement

  constructor(container: HTMLElement, onSubmit: () => void, onInput: (field: string, value: string) => void) {
    super(container, onSubmit)
    this.paymentButtons = container.querySelectorAll('.order__buttons .button')
    this.addressInput = container.querySelector('input[name="address"]')!

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        onInput('payment', button.name)
      })
    })

    this.addressInput.addEventListener('input', () => {
      onInput('address', this.addressInput.value)
    })
  }

  private selectPayment(button: HTMLButtonElement): void {
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'))
    button.classList.add('button_alt-active')
  }

  set payment(value: string | null) {
    if (value) {
      this.paymentButtons.forEach(btn => {
        if (btn.name === value) {
          this.selectPayment(btn)
        }
      })
    }
  }

  set address(value: string) {
    this.addressInput.value = value
  }
}