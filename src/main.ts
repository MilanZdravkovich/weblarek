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
const basketView = new BasketView(cloneTemplate(basketTemplate), () => events.emit('order:open'))
const orderForm = new OrderForm(cloneTemplate(orderTemplate), () => events.emit('contacts:open'),
 (field, value) => {buyerModel.setField(field as 'payment' | 'address', value as string)}
)
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), () => events.emit('order:submit'),
  (field, value) => {buyerModel.setField(field as 'email' | 'phone', value)}
)

function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  return template.content.firstElementChild!.cloneNode(true) as HTMLElement
}

function createCatalogCard(product: IProduct): HTMLElement {
  const container = cloneTemplate(cardCatalogTemplate)
  const card = new CardCatalog(container, () => {
      events.emit('product:open', {id: product.id})
    })

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
    const card = new CardBasket(container, () => {
        events.emit('basket:remove', {id: item.id})
      })

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

events.on('product:open', (data: {id: string}) => {
  const product = productsModel.getItem(data.id)
  if (!product) return

  productsModel.setSelected(product)

  const container = cloneTemplate(cardPreviewTemplate)
  const isInBasket = basketModel.contains(product.id)
  const card = new CardPreview(container, () => {
      events.emit('basket:toggle', {id: product.id})
    })

  card.category = product.category
  card.title = product.title
  card.description = product.description
  card.image = CDN_URL + product.image
  card.price = product.price
  if (product.price === null) {
    card.buttonText = 'Недоступно'
    card.isDisabled = true
  } else {
    card.buttonText = isInBasket ? 'Удалить из корзины' : 'В корзину'
    card.isDisabled = false
  }

  modal.render({content: card.render()})
})

events.on('basket:toggle', (data: {id: string}) => {
  const product = productsModel.getItem(data.id)
  if (!product) return

  if (basketModel.contains(data.id)) {
    basketModel.removeItem(product)
  } else {
    basketModel.addItem(product)
  }
  modal.close()
})

events.on('basket:open', () => {
  renderBasket(basketView)
  modal.render({content: basketView.render()})
})

events.on('basket:changed', () => {
  header.count = basketModel.getCount()
  renderBasket(basketView)
})

events.on('basket:remove', (data: {id: string}) => {
  basketModel.removeItemById(data.id)
})

events.on('order:open', () => {
  orderForm.payment = buyerModel.getData().payment
  orderForm.address = buyerModel.getData().address
  orderForm.errors = buyerModel.validateFields(['payment', 'address'])
  orderForm.isDisabled = Object.keys(buyerModel.validateFields(['payment', 'address'])).length > 0

  modal.render({content: orderForm.render()})
})

events.on('contacts:open', () => {
  contactsForm.email = buyerModel.getData().email
  contactsForm.phone = buyerModel.getData().phone
  contactsForm.errors = buyerModel.validateFields(['email', 'phone'])
  contactsForm.isDisabled = Object.keys(buyerModel.validateFields(['email', 'phone'])).length > 0

  modal.render({content: contactsForm.render()})
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

      modal.render({content: successView.render()})
    })
    .catch((error) => {
      console.error('Ошибка заказа: ', error)
    })
})


events.on('buyer:changed', () => {
  const buyerData = buyerModel.getData()

  orderForm.payment = buyerData.payment
  orderForm.address = buyerData.address
  orderForm.errors = buyerModel.validateFields(['payment', 'address'])
  orderForm.isDisabled = Object.keys(buyerModel.validateFields(['payment', 'address'])).length > 0

  contactsForm.email = buyerData.email
  contactsForm.phone = buyerData.phone
  contactsForm.errors = buyerModel.validateFields(['email', 'phone'])
  contactsForm.isDisabled = Object.keys(buyerModel.validateFields(['email', 'phone'])).length > 0
})

appApi.getProducts()
  .then((response) => {
    productsModel.setItems(response.items)
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error)
  })