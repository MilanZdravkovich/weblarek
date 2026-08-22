import './scss/styles.scss';

import {Api} from './components/base/Api.ts'
import {AppApi} from './components/communications/AppApi.ts'
import {Products} from './components/Models/Products.ts'
import {Basket} from './components/Models/Basket.ts'
import {Buyer} from './components/Models/Buyer.ts'
import {API_URL} from './utils/constants'
import {apiProducts} from './utils/data'

const baseApi = new Api(API_URL)

const appApi = new AppApi(baseApi)

const productsModel = new Products()
const basketModel = new Basket()
const buyerModel = new Buyer()

console.log('=== Тестирование каталога товаров ===')

productsModel.setItems(apiProducts.items)
console.log('Maссив товаров из каталога: ', productsModel.getItems())

const productId = apiProducts.items[0].id
console.log('Товар по id: ', productsModel.getItem(productId))

productsModel.setSelected(apiProducts.items[1])
console.log('Выбранный товар: ', productsModel.getSelected())

console.log('=== Тестирование корзины ===')

basketModel.addItem(apiProducts.items[0])
basketModel.addItem(apiProducts.items[1])
console.log('Товары в корзине: ', basketModel.getItems())

console.log('Количество товаров: ', basketModel.getCount())
console.log('Общая стоимость: ', basketModel.getTotal())

console.log('Товар с id в корзне: ', basketModel.contains(productId))

basketModel.removeItem(apiProducts.items[0])
console.log('После удаления: ', basketModel.getItems())

basketModel.clear()
console.log('После очистки: ', basketModel.getItems())
console.log('Количество после очистки: ', basketModel.getCount())

console.log('=== Тестирование данных покупателя ===')

buyerModel.setField('address', 'Санкт-Петербург, ул. Восстания, 1')
buyerModel.setField('email', 'test@test.ru')
buyerModel.setField('phone', '+71234567890')
buyerModel.setField('payment', 'cash')

console.log('Данные покупателя: ', buyerModel.getData())

console.log('Ошибка валидации: ', buyerModel.validate())

buyerModel.clear()
console.log('После очистки: ', buyerModel.getData())

console.log('Ошибки после очистки: ', buyerModel.validate())

console.log('=== Работа с сервером ===')

appApi.getProducts()
  .then((response) => {
    console.log('Ответ сервера: ', response)

    productsModel.setItems(response.items)
    console.log('Каталог из сервера: ', productsModel.getItems())
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров: ', error)
  })