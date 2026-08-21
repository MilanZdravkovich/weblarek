import {IBuyer} from "../../../types/index.ts"

export class Buyer {
  private _data: IBuyer = {
    payment: 'card',
    email: '',
    phone: '',
    address: ''
  }

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this._data[field] = value
  }

  getData(): IBuyer {
    return this._data
  }

  clear(): void {
    this._data = {
      payment: 'card',
      email: '',
      phone: '',
      address: ''
    }
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {}
    
    if (!this._data.payment) {
      errors.payment = 'Не выбран способ оплаты'
    }

    if (!this._data.address) {
      errors.address = 'Укажите адрес доставки'
    }

    if (!this._data.email) {
      errors.email = 'Укажите email'
    }

    if (!this._data.phone) {
      errors.phone = 'Укажите телефон'
    }

    return errors
  }
}