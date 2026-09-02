import {Component} from '../base/Component'
import {TValidationErrors} from '../../types'

interface IFormData {
  errors: TValidationErrors
}

export abstract class Form<T extends IFormData> extends Component<T> {
  private submitButton: HTMLButtonElement
  private errorsElement: HTMLElement

  constructor(container: HTMLElement, onSubmit: () => void) {
    super(container)
    this.submitButton = container.querySelector('button[type="submit"]')!
    this.errorsElement = container.querySelector('.form__errors')!

    container.addEventListener('submit', (e) => {
      e.preventDefault()
      onSubmit()
    })
  }

  set errors(value: TValidationErrors) {
    this.errorsElement.textContent = Object.values(value).join(', ')
  }

  set isDisabled(value: boolean) {
    this.submitButton.disabled = value
  }
}