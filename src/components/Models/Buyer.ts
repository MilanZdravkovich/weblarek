import {IBuyer, TValidationErrors} from "../../types/index.ts"

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  }

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value
  }

  getData(): IBuyer {
    return this.data
  }

  clear(): void {
    this.data = {
      payment: 'card',
      email: '',
      phone: '',
      address: ''
    }
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: TValidationErrors = {}
    
    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты'
    }

    if (!this.data.address) {
      errors.address = 'Укажите адрес доставки'
    }

    if (!this.data.email) {
      errors.email = 'Укажите email'
    }

    if (!this.data.phone) {
      errors.phone = 'Укажите телефон'
    }

    return errors
  }
}