import './scss/styles.scss';

import {Api} from './components/base/Api.ts'
import {EventEmitter} from './components/base/Events.ts'
import {AppApi} from './components/communications/AppApi.ts'
import {Products} from './components/Models/Products.ts'
import {Basket} from './components/Models/Basket.ts'
import {Buyer} from './components/Models/Buyer.ts'
import {Header} from './components/view/Header.ts'
import {Gallery} from './components/view/Gallery.ts'
import {Modal} from './components/view/Modal.ts'
import {CardCatalog} from './components/view/CardCatalog.ts'
import {CardPreview} from './components/view/CardPreview.ts'
import {CardBasket} from './components/view/CardBasket.ts'
import {BasketView} from './components/view/BasketView.ts'
import {OrderForm} from './components/view/OrderForm.ts'
import {ContactsForm} from './components/view/ContactsForm.ts'
import {SuccessView} from './components/view/SuccessView.ts'
import {API_URL, CDN_URL} from './utils/constants'
import { IProduct, IOrderRequest } from './types/index.ts'


const events = new EventEmitter()

const baseApi = new Api(API_URL)
const appApi = new AppApi(baseApi)

const productsModel = new Products(events)
const basketModel = new Basket(events)
const buyerModel = new Buyer(events)

const headerContainer = document.querySelector('.header')! as HTMLElement
const galleryContainer = document.querySelector('.gallery')! as HTMLElement
const modalContainer = document.querySelector('#modal-container')! as HTMLElement

const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement
const orderTemplate = document.getElementById('order') as HTMLTemplateElement
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement
const successTemplate = document.getElementById('success') as HTMLTemplateElement

const header = new Header(headerContainer, () => events.emit('basket:open'))
const gallery = new Gallery(galleryContainer)
const modal = new Modal(modalContainer)

function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  return template.content.firstElementChild!.cloneNode(true) as HTMLElement
}

function createCatalogCard(product: IProduct): HTMLElement {
  const container = cloneTemplate(cardCatalogTemplate)
  const card = new CardCatalog(container, (id) => {
    const item = productsModel.getItem(id)
    if (item) {
      productsModel.setSelected(item)
      events.emit('product:open', {product: item})
    }
  })

  card.itemId = product.id
  card.category = product.category
  card.title = product.title
  card.image = CDN_URL + product.image
  card.price = product.price

  return container
}

function renderBasket(basketView: BasketView): void {
  const items = basketModel.getItems()
  const basketItems = items.map((item, index) => {
    const container = cloneTemplate(cardBasketTemplate)
    const card = new CardBasket(container, (id) => {
      const product = productsModel.getItem(id)
      if (product) {
        basketModel.removeItem(product)
        const updatedBasket = new BasketView(cloneTemplate(basketTemplate), () => events.emit('order:open'))
        renderBasket(updatedBasket)
        modal.render({content: updatedBasket.render()})
      }
    })

    card.itemId = item.id
    card.index = index + 1
    card.title = item.title
    card.price = item.price

    return container
  })

  basketView.items = basketItems
  basketView.total = basketModel.getTotal()
  basketView.isDisabled = items.length === 0
}

events.on('products:changed', (data: {items: IProduct[]}) => {
  const card = data.items.map(item => createCatalogCard(item))
  gallery.items = card
})

events.on('product:open', (data: {product: IProduct}) => {
  const container = cloneTemplate(cardPreviewTemplate)
  const isInBasket = basketModel.contains(data.product.id)
  const card = new CardPreview(container, (id) => {
    const item = productsModel.getItem(id)
    if (item) {
      if (basketModel.contains(id)) {
        basketModel.removeItem(item)
      } else {
        basketModel.addItem(item)
      }
      modal.close()
    }
  })

  card.itemId = data.product.id
  card.category = data.product.category
  card.title = data.product.title
  card.description = data.product.description
  card.image = CDN_URL + data.product.image
  card.price = data.product.price
  card.isInBasket = isInBasket

  modal.render({content: container})
})

events.on('basket:open', () => {
  const container = cloneTemplate(basketTemplate)
  const basketView = new BasketView(container, () => events.emit('order:open'))

  renderBasket(basketView)

  modal.render({content: container})
})

events.on('basket:changed', () => {
  header.count = basketModel.getCount()
})

events.on('order:open', () => {
  const container = cloneTemplate(orderTemplate)
  const orderForm = new OrderForm(
    container,
    () => events.emit('contacts:open'),
    (field, value) => {
      buyerModel.setField(field as 'payment' | 'address', value as string)

      orderForm.errors = buyerModel.validateFields(['payment', 'address'])
      orderForm.isDisabled = Object.keys(buyerModel.validateFields(['payment', 'address'])).length > 0
    }
  )

  orderForm.payment = buyerModel.getData().payment
  orderForm.address = buyerModel.getData().address
  orderForm.errors = buyerModel.validateFields(['payment', 'address'])
  orderForm.isDisabled = Object.keys(buyerModel.validateFields(['payment', 'address'])).length > 0

  modal.render({content: container})
})

events.on('contacts:open', () => {
  const container = cloneTemplate(contactsTemplate)
  const contactsForm = new ContactsForm(
    container,
    () => events.emit('order:submit'),
    (field, value) => {
      buyerModel.setField(field as 'email' | 'phone', value)

      contactsForm.errors = buyerModel.validateFields(['email', 'phone'])
      contactsForm.isDisabled = Object.keys(buyerModel.validateFields(['email', 'phone'])).length > 0
    }
  )

  contactsForm.email = buyerModel.getData().email
  contactsForm.phone = buyerModel.getData().phone
  contactsForm.errors = buyerModel.validateFields(['email', 'phone'])
  contactsForm.isDisabled = Object.keys(buyerModel.validateFields(['email', 'phone'])).length > 0

  modal.render({content: container})
})

events.on('order:submit', () => {
  const buyerData = buyerModel.getData()
  const orderData: IOrderRequest = {
    payment: buyerData.payment!,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotal(),
    items: basketModel.getItems().map(item => item.id)
}

  appApi.makeOrder(orderData)
    .then((response) => {
      basketModel.clear()
      buyerModel.clear()

      const container = cloneTemplate(successTemplate)
      const successView = new SuccessView(container, () => modal.close())
      successView.total = response.total

      modal.render({content: container})
    })
    .catch((error) => {
      console.error('Ошибка заказа: ', error)
    })
})

appApi.getProducts()
  .then((response) => {
    productsModel.setItems(response.items)
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error)
  })

// console.log('=== Тестирование каталога товаров ===')

// productsModel.setItems(apiProducts.items)
// console.log('Maссив товаров из каталога: ', productsModel.getItems())

// const productId = apiProducts.items[0].id
// console.log('Товар по id: ', productsModel.getItem(productId))

// productsModel.setSelected(apiProducts.items[1])
// console.log('Выбранный товар: ', productsModel.getSelected())

// console.log('=== Тестирование корзины ===')

// basketModel.addItem(apiProducts.items[0])
// basketModel.addItem(apiProducts.items[1])
// console.log('Товары в корзине: ', basketModel.getItems())

// console.log('Количество товаров: ', basketModel.getCount())
// console.log('Общая стоимость: ', basketModel.getTotal())

// console.log('Товар с id в корзне: ', basketModel.contains(productId))

// basketModel.removeItem(apiProducts.items[0])
// console.log('После удаления: ', basketModel.getItems())

// basketModel.clear()
// console.log('После очистки: ', basketModel.getItems())
// console.log('Количество после очистки: ', basketModel.getCount())

// console.log('=== Тестирование данных покупателя ===')

// buyerModel.setField('address', 'Санкт-Петербург, ул. Восстания, 1')
// buyerModel.setField('email', 'test@test.ru')
// buyerModel.setField('phone', '+71234567890')
// buyerModel.setField('payment', 'cash')

// console.log('Данные покупателя: ', buyerModel.getData())

// console.log('Ошибка валидации: ', buyerModel.validate())

// buyerModel.clear()
// console.log('После очистки: ', buyerModel.getData())

// console.log('Ошибки после очистки: ', buyerModel.validate())

// console.log('=== Работа с сервером ===')

// appApi.getProducts()
//   .then((response) => {
//     console.log('Ответ сервера: ', response)

//     productsModel.setItems(response.items)
//     console.log('Каталог из сервера: ', productsModel.getItems())
//   })
//   .catch((error) => {
//     console.error('Ошибка при получении товаров: ', error)
//   })