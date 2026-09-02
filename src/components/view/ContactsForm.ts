import {Form} from './Form'
import {IContactsForm} from '../../types'

export class ContactsForm extends Form<IContactsForm> {
  private emailInput: HTMLInputElement
  private phoneInput: HTMLInputElement

  constructor(container: HTMLElement, onSubmit: () => void, onInput: (field: string, value: string) => void) {
    super(container, onSubmit)
    this.emailInput = container.querySelector('input[name="email"]')!
    this.phoneInput = container.querySelector('input[name="phone"]')!

    this.emailInput.addEventListener('input', () => {
      onInput('email', this.emailInput.value)
    })

    this.phoneInput.addEventListener('input', () => {
      onInput('phone', this.phoneInput.value)
    })
  }

  set email(value: string) {
    this.emailInput.value = value
  }

  set phone(value: string) {
    this.phoneInput.value = value
  }
}