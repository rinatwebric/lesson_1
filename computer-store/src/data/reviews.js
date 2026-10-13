import { getLang } from '../i18n/core.js'

// Demo reviews: [rating, author, city, ISO date, text, English author, English text]
const seed = {
  101: [
    [5, 'Айбек К.', 'Бишкек', '2026-08-14', 'Cyberpunk в 4K на ультра-настройках держит стабильные 90+ кадров. Под нагрузкой почти не слышно.', 'Aibek K.', 'Cyberpunk at 4K on ultra settings holds a steady 90+ fps. Almost silent under load.'],
    [5, 'Нурлан Т.', 'Ош', '2026-07-30', 'Кабели уложены идеально, привезли на следующий день и помогли с первой настройкой.', 'Nurlan T.', 'Cables are neatly routed. Delivered the next day, and they helped with the first setup.'],
    [4, 'Эркин М.', 'Каракол', '2026-07-02', 'Отличный компьютер. Из минусов только то, что в комплекте нет клавиатуры.', 'Erkin M.', 'Great computer. The only downside is that no keyboard is included.'],
    [5, 'Бермет Ж.', 'Токмок', '2026-06-11', 'Третий месяц пользуюсь каждый день, ни одного сбоя. Рекомендую всем, кто хочет играть без компромиссов.', 'Bermet Zh.', 'Using it every day for three months with not a single crash. Recommended for anyone who wants to game without compromises.'],
  ],
  102: [
    [4, 'Алина Л.', 'Джалал-Абад', '2026-08-21', 'За свои деньги лучший вариант для Full HD и 1440p. Все новые игры идут на высоких.', 'Alina L.', 'Best value for Full HD and 1440p. All new games run on high settings.'],
    [4, 'Тимур Н.', 'Кант', '2026-07-18', 'Хороший баланс цены и мощности. Памяти хотелось бы больше, но апгрейд делается за пять минут.', 'Timur N.', 'A good balance of price and performance. I would have liked more memory, but the upgrade takes five minutes.'],
    [5, 'Айгуль С.', 'Бишкек', '2026-06-25', 'Брала сыну, доволен. Тихий и не греется даже вечером за долгой игрой.', 'Aigul S.', 'Bought it for my son and I am happy with it. Quiet, and it does not overheat even during long evening sessions.'],
  ],
  103: [
    [5, 'Жаныбек А.', 'Бишкек', '2026-08-09', 'Рендер сцены в Blender ускорился в разы по сравнению со старой станцией.', 'Zhanybek A.', 'Blender scene renders are many times faster than on my old workstation.'],
    [5, 'Студия «Пиксель»', 'Бишкек', '2026-07-11', 'Монтируем 8K без просадок, охлаждение справляется в любую жару.', 'Pixel Studio', 'We edit 8K without dropouts, and the cooling copes in any heat.'],
    [5, 'Олег Б.', 'Ош', '2026-06-03', 'Мощь невероятная, цена соответствующая. Для профессиональных задач окупается быстро.', 'Oleg B.', 'Incredible power, priced accordingly. It pays for itself quickly on professional work.'],
  ],
  104: [
    [5, 'Анара М.', 'Бишкек', '2026-08-02', 'Компактная, помещается на стол рядом с монитором. В офисе её почти не слышно.', 'Anara M.', 'Compact enough to fit on the desk next to the monitor. Almost inaudible in the office.'],
    [4, 'Роман Ж.', 'Каракол', '2026-07-15', 'Для разработки и виртуалок то, что нужно. Хотелось бы больше портов на передней панели.', 'Roman Zh.', 'Just what I need for development and VMs. I would like more ports on the front panel.'],
    [5, 'Никита П.', 'Токмок', '2026-06-20', 'Собрана аккуратно, ни одного лишнего провода. Работает быстро и тихо.', 'Nikita P.', 'Neatly built, not a single spare cable. Fast and quiet.'],
  ],
  105: [
    [4, 'Анна Ш.', 'Бишкек', '2026-08-18', 'Лёгкий, в рюкзаке не чувствуется. Заряда хватает на целый рабочий день.', 'Anna Sh.', 'Light enough that you barely feel it in a backpack. The battery lasts a full workday.'],
    [4, 'Владимир Д.', 'Ош', '2026-07-22', 'Экран яркий и чёткий. Динамики могли бы быть громче.', 'Vladimir D.', 'Bright, sharp screen. The speakers could be louder.'],
    [5, 'Гульзат Ф.', 'Джалал-Абад', '2026-06-29', 'Лучший ноутбук для поездок: быстрый, тонкий и почти не греется.', 'Gulzat F.', 'The best laptop for travel: fast, thin, and it barely gets warm.'],
  ],
  106: [
    [5, 'Максим Е.', 'Бишкек', '2026-08-25', 'Цвета на экране точные, для обработки фото и видео подходит идеально.', 'Maksim E.', 'Accurate on-screen colors, ideal for photo and video editing.'],
    [5, 'Юлия А.', 'Ош', '2026-07-27', 'Мощности хватает и для работы, и для игр. Клавиатура очень приятная.', 'Yulia A.', 'Enough power for both work and games. The keyboard is very pleasant to type on.'],
    [4, 'Артём К.', 'Кант', '2026-07-05', 'Отличный, но тяжеловат для частых поездок. Автономность лучше ожиданий.', 'Artem K.', 'Excellent, but a bit heavy for frequent travel. Battery life is better than expected.'],
    [5, 'Дарья Т.', 'Каракол', '2026-06-18', 'Экран просто космос, а клавиатура удобнее, чем у многих настольных.', 'Darya T.', 'The screen is out of this world, and the keyboard is more comfortable than many desktop ones.'],
  ],
  107: [
    [5, 'Виктор Л.', 'Бишкек', '2026-08-12', 'Картинка очень чёткая, текст читается без усилий. Подключается к ноутбуку одним кабелем.', 'Viktor L.', 'The picture is very sharp and text reads effortlessly. It connects to a laptop with a single cable.'],
    [4, 'Татьяна Г.', 'Токмок', '2026-07-19', 'Цвета точные прямо из коробки. Подставка могла бы регулироваться больше.', 'Tatiana G.', 'Colors are accurate right out of the box. The stand could adjust more.'],
    [5, 'Денис О.', 'Ош', '2026-06-14', 'Для работы с графикой и кода — идеальный вариант по цене.', 'Denis O.', 'An ideal price-to-value option for graphics and coding work.'],
  ],
  108: [
    [5, 'Кирилл Н.', 'Бишкек', '2026-08-30', 'Чёрный по-настоящему чёрный. В играх и фильмах эффект просто невероятный.', 'Kirill N.', 'Blacks are truly black. The effect in games and movies is simply incredible.'],
    [5, 'Александр Ч.', 'Балыкчи', '2026-07-24', 'Два окна рядом и ещё остаётся место. Монтаж стал в разы удобнее.', 'Alexander Ch.', 'Two windows side by side with room to spare. Editing is much more convenient now.'],
    [4, 'Евгений М.', 'Каракол', '2026-07-01', 'Отличный экран, но стоит беречь от статичных картинок. Дорого, но стоит своих денег.', 'Evgeny M.', 'Great screen, but keep static images off it. Expensive, but worth the money.'],
    [5, 'Лариса П.', 'Бишкек', '2026-06-08', 'Работаю с видео, цвета и контраст на высоте. Лучший монитор, что у меня был.', 'Larisa P.', 'I work with video, and color and contrast are top notch. The best monitor I have owned.'],
  ],
  109: [
    [4, 'Лев З.', 'Ош', '2026-08-08', 'Звук печати мягкий, ход приятный. Переключатели меняются без пайки.', 'Lev Z.', 'Soft typing sound and a pleasant travel. Switches swap without soldering.'],
    [4, 'София Р.', 'Бишкек', '2026-07-13', 'Удобная и компактная. Подключается к трём устройствам, переключение мгновенное.', 'Sofia R.', 'Comfortable and compact. Connects to three devices with instant switching.'],
    [4, 'Тимур А.', 'Джалал-Абад', '2026-06-17', 'Лучшая клавиатура, что у меня была. Белая подсветка ровная и не слепит.', 'Timur A.', 'The best keyboard I have owned. The white backlight is even and not glaring.'],
  ],
  110: [
    [5, 'Глеб С.', 'Бишкек', '2026-08-16', 'Невесомая, рука не устаёт даже к вечеру. Сенсор точный.', 'Gleb S.', 'Feather-light, so your hand does not tire even by evening. The sensor is precise.'],
    [3, 'Арина В.', 'Каракол', '2026-07-21', 'Хорошая мышь, заряда хватает на недели. Колёсико могло бы быть тише.', 'Arina V.', 'Good mouse, and the battery lasts for weeks. The scroll wheel could be quieter.'],
    [4, 'Михаил Д.', 'Токмок', '2026-06-26', 'Для работы и игр подходит. Приятные материалы, не скользит в руке.', 'Mikhail D.', 'Works for both work and games. Pleasant materials that do not slip in the hand.'],
  ],
  111: [
    [5, 'Руслан Х.', 'Бишкек', '2026-08-04', 'Игры грузятся мгновенно, копирование больших проектов занимает секунды.', 'Ruslan Kh.', 'Games load instantly, and copying large projects takes seconds.'],
    [5, 'Полина Б.', 'Ош', '2026-07-09', 'Радиатор в комплекте, температуры в норме даже под нагрузкой.', 'Polina B.', 'Heatsink included, and temperatures stay normal even under load.'],
    [4, 'Георгий Т.', 'Бишкек', '2026-06-12', 'Очень быстрый. Установка заняла две минуты, система определила сразу.', 'Georgy T.', 'Very fast. Installation took two minutes, and the system detected it right away.'],
    [5, 'Ярослав М.', 'Кант', '2026-05-30', 'Заметно быстрее прежнего диска. Работает холодно, ни одного замечания.', 'Yaroslav M.', 'Noticeably faster than my old drive. It runs cool, no complaints.'],
  ],
  112: [
    [4, 'Данил Ф.', 'Бишкек', '2026-08-20', 'Профиль EXPO включился с первого раза, система стабильна уже месяц.', 'Danil F.', 'The EXPO profile enabled on the first try, and the system has been stable for a month.'],
    [4, 'Вера К.', 'Ош', '2026-07-16', 'Хорошая память для своей цены. Не греется, планки аккуратные.', 'Vera K.', 'Good memory for the price. It does not get hot, and the modules are neat.'],
    [4, 'Станислав И.', 'Каракол', '2026-06-22', 'Поставил в обе сборки, обе работают без сбоев. Рекомендую.', 'Stanislav I.', 'Installed it in both builds, and both run without issues. Recommended.'],
  ],
}

const CITY_EN = {
  'Бишкек': 'Bishkek',
  'Ош': 'Osh',
  'Каракол': 'Karakol',
  'Токмок': 'Tokmok',
  'Джалал-Абад': 'Jalal-Abad',
  'Кант': 'Kant',
  'Балыкчи': 'Balykchy',
}

export const seedReviews = Object.fromEntries(
  Object.entries(seed).map(([id, list]) => [
    id,
    list.map(([rating, author, city, date, text, enAuthor, enText], i) => ({
      id: `s${id}-${i}`,
      rating,
      author,
      city,
      date,
      text,
      verified: true,
      en: { author: enAuthor, city: CITY_EN[city] ?? city, text: enText },
    })),
  ]),
)

// Seed reviews carry an `en` translation; user-written reviews have none and pass through unchanged.
export function localizeReview(review, lang = getLang()) {
  if (lang !== 'en' || !review?.en) return review
  const { en, ...rest } = review
  return { ...rest, ...en }
}

export function ratingStats(reviews, fallback = 0) {
  const count = reviews.length
  const dist = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => r.rating === n).length)
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : fallback
  return { avg, count, dist }
}

export const reviewWord = (n, lang = getLang()) => {
  if (lang === 'en') return n === 0 ? 'no reviews' : `${n} ${n === 1 ? 'review' : 'reviews'}`
  const m = n % 10, h = n % 100
  return n === 0 ? 'нет отзывов' : `${n} ${m === 1 && h !== 11 ? 'отзыв' : m >= 2 && m <= 4 && (h < 12 || h > 14) ? 'отзыва' : 'отзывов'}`
}
