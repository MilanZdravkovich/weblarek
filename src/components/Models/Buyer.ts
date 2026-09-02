import {IBuyer, TValidationErrors} from "../../types"
import {IEvents} from "../base/Events"

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  }

  constructor(private events: IEvents) {}

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value
    this.events.emit('buyer:changed', {data: this.data})
  }

  getData(): IBuyer {
    return this.data
  }

  clear(): void {
    this.data = {
      payment: null,
      email: '',
      phone: '',
      address: ''
    }
    this.events.emit('buyer:changed', {data: this.data})
  }

  validate(): TValidationErrors {
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

  validateFields(fields: (keyof IBuyer)[]): TValidationErrors {
    const errors: TValidationErrors = {};

    if (fields.includes('payment') && !this.data.payment) {
        errors.payment = 'Не выбран способ оплаты';
    }

    if (fields.includes('address') && !this.data.address) {
        errors.address = 'Укажите адрес доставки';
    }

    if (fields.includes('email') && !this.data.email) {
        errors.email = 'Укажите email';
    }

    if (fields.includes('phone') && !this.data.phone) {
        errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}