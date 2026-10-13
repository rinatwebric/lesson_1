import { CONTACTS, COURIER_FEE, FREE_COURIER_FROM } from './contacts.js'
import { fmtPrice, getLang } from '../i18n/core.js'

// Items are [question, answer] tuples, rendered by components/Faq.jsx.
const ru = [
  ['Сколько времени занимает сборка?', 'Собираем и тестируем компьютер за 48 часов. После сборки 12 часов гоняем стресс-тесты, чтобы вы получили проверенную систему, а не просто набор деталей.'],
  ['Какая гарантия на компьютеры?', 'На сборки Nexus действует гарантия 3 года. На комплектующие и периферию — официальная гарантия производителя от 12 до 36 месяцев, срок зависит от товара. Если что-то сломалось в гарантийный период, поможем с обращением и ремонтом.'],
  ['Как проверяется совместимость в конфигураторе?', 'Конфигуратор сам проверяет сокет и тип памяти, размер платы и корпуса, высоту кулера, длину видеокарты и запас по мощности блока питания. Несовместимые варианты помечаются, и такую сборку нельзя добавить в корзину.'],
  ['Сколько стоит и как быстро приходит доставка?', `По Бишкеку доставляем в день заказа или на следующий день. Заказы от ${fmtPrice(FREE_COURIER_FROM, 'ru')} везём бесплатно, при меньшей сумме доставка курьером стоит ${fmtPrice(COURIER_FEE, 'ru')}. В Ош, Джалал-Абад, Каракол, Нарын, Талас, Баткен и другие регионы отправляем грузовой или транспортной компанией: срок 2–5 дней, стоимость оплачивает получатель по тарифу перевозчика. Заказ можно забрать самовывозом: ${CONTACTS.address.ru}.`],
  ['Можно ли вернуть товар?', 'Да, в течение 14 дней, если товар не использовался и сохранил товарный вид. Возврат оформляется по законодательству Кыргызской Республики о защите прав потребителей. Для компьютеров, собранных по индивидуальному заказу, менеджер объяснит условия до оплаты.'],
  ['Как оплатить заказ?', 'Наличными при получении или на самовывозе, банковской картой (Visa, Mastercard, Элкарт), переводом через мобильный банкинг (Mbank, O!Dengi, Optima Bank). Юридическим лицам выставляем счёт и принимаем банковский перевод.'],
  ['Что такое trade-in?', 'Вы сдаёте старый компьютер или ноутбук, мы оцениваем его и вычитаем сумму из стоимости новой техники. Оценка бесплатная, она занимает около 15 минут.'],
  ['Делаете ли вы апгрейд и ремонт?', 'Да, у нас собственный сервис: диагностика, замена комплектующих, чистка и замена термопасты. Для техники, купленной у нас, диагностика бесплатна.'],
]

const en = [
  ['How long does assembly take?', 'We assemble and test every computer within 48 hours. After assembly it runs 12 hours of stress tests, so you get a verified system, not just a box of parts.'],
  ['What warranty do you offer?', `Nexus builds come with a 3-year warranty. Components and peripherals carry the manufacturer's official warranty of 12 to 36 months, depending on the product. If something fails under warranty, we will help with the claim and the repair.`],
  ['How does the configurator check compatibility?', 'The configurator automatically checks the socket and memory type, motherboard and case size, cooler height, GPU length and power supply headroom. Incompatible options are flagged, and such a build cannot be added to the cart.'],
  ['How much is delivery and how fast is it?', `In Bishkek we deliver on the day of the order or the next day. Orders from ${fmtPrice(FREE_COURIER_FROM, 'en')} ship free; below that, courier delivery costs ${fmtPrice(COURIER_FEE, 'en')}. We ship to Osh, Jalal-Abad, Karakol, Naryn, Talas, Batken and other regions by cargo or carrier in 2–5 days, and the recipient pays the carrier's fee. You can also pick up your order at ${CONTACTS.address.en}.`],
  ['Can I return a product?', 'Yes, within 14 days if the item is unused and keeps its original condition. Returns follow the consumer protection law of the Kyrgyz Republic. For custom-built computers, the manager will explain the terms before payment.'],
  ['How can I pay?', 'Cash on delivery or at pickup, bank card (Visa, Mastercard, Elcart), or mobile banking transfer (Mbank, O!Dengi, Optima Bank). Companies can request an invoice and pay by bank transfer.'],
  ['What is trade-in?', 'You hand in an old computer or laptop, we assess it and deduct the amount from the price of new equipment. The assessment is free and takes about 15 minutes.'],
  ['Do you offer upgrades and repairs?', 'Yes, we have our own service center: diagnostics, component replacement, cleaning and thermal paste replacement. Diagnostics are free for equipment bought from us.'],
]

// Russian list kept under the original name so existing imports keep working.
export const FAQ = ru

export const getFaq = (lang = getLang()) => (lang === 'en' ? en : ru)
