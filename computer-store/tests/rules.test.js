import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { PRESETS, SLOTS, check, optionErrors, summarize } from '../src/configurator/rules.js'

const { products } = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url)))
const byId = (id) => products.find((p) => p.id === id)
const build = (ids) => Object.fromEntries(Object.entries(ids).map(([slot, id]) => [slot, byId(id)]))

test('presets are complete and fully compatible without warnings', () => {
  for (const preset of PRESETS) {
    const s = summarize(build(preset.parts))
    assert.deepEqual(s.missing.map((m) => m.id), [], preset.id)
    assert.deepEqual(s.issues, [], preset.id)
    assert.equal(s.complete, true, preset.id)
  }
})

test('preset parts belong to the right slot category', () => {
  for (const preset of PRESETS) {
    for (const slot of SLOTS) {
      const p = byId(preset.parts[slot.id])
      if (p) assert.equal(p.cat, slot.cat, `${preset.id}/${slot.id}`)
    }
  }
})

test('socket mismatch', () => {
  const issues = check(build({ cpu: 11, motherboard: 23 }))
  assert.equal(issues.length, 1)
  assert.deepEqual(issues[0].slots, ['cpu', 'motherboard'])
})

test('memory type mismatch', () => {
  assert.equal(check(build({ ram: 30, motherboard: 23 })).filter((i) => i.level === 'error').length, 1)
  assert.equal(check(build({ ram: 30, motherboard: 26 })).length, 0)
})

test('motherboard form factor must fit the case', () => {
  assert.equal(check(build({ motherboard: 23, case: 36 })).length, 1)
  assert.equal(check(build({ motherboard: 24, case: 36 })).length, 0)
})

test('gpu length against case', () => {
  assert.equal(check(build({ gpu: 9, case: 36 })).length, 1)
  assert.equal(check(build({ gpu: 9, case: 37 })).length, 0)
})

test('cooler: height, radiator and power headroom', () => {
  assert.equal(check(build({ cooler: 38, case: 36 })).length, 0)
  assert.equal(check(build({ cooler: 40, case: 36 })).length, 1)
  const warn = check(build({ cooler: 39, cpu: 10 }))
  assert.deepEqual(warn.map((i) => i.level), ['warn'])
})

test('power supply: error below load, warning below headroom', () => {
  const base = { cpu: 10, gpu: 9 } // 120 + 450 + 100 = 670 W, recommended 900 W
  assert.deepEqual(check(build({ ...base, psu: 31 })).map((i) => i.level), ['error'])
  assert.deepEqual(check(build({ ...base, psu: 33 })).map((i) => i.level), ['warn'])
  assert.deepEqual(check(build({ ...base, psu: 34 })), [])
})

test('optionErrors only reports errors involving the candidate slot', () => {
  const parts = build({ cpu: 10, motherboard: 23, ram: 30 }) // ram already conflicts with board
  assert.equal(optionErrors('cpu', byId(11), parts).length, 1)
  assert.equal(optionErrors('cpu', byId(12), parts).length, 0)
  assert.equal(optionErrors('cooler', byId(38), parts).length, 0)
})

test('summarize reports missing parts and totals', () => {
  const s = summarize(build({ cpu: 10 }))
  assert.equal(s.complete, false)
  assert.equal(s.total, byId(10).price)
  assert.equal(s.missing.length, SLOTS.filter((x) => x.required).length - 1)
})

test('showcase catalog: 12 products, two per group, each with an existing photo', () => {
  const shop = products.filter((p) => p.group)
  assert.equal(shop.length, 12)
  const counts = {}
  for (const p of shop) counts[p.group] = (counts[p.group] ?? 0) + 1
  assert.deepEqual(Object.values(counts), [2, 2, 2, 2, 2, 2])
  for (const p of shop) {
    assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)), `${p.name}: ${p.image}`)
    assert.ok(p.highlights.length >= 2 && p.highlights.length <= 3, p.name)
    assert.equal(typeof p.popularity, 'number', p.name)
  }
  assert.equal(new Set(products.map((p) => p.id)).size, products.length)
})

test('lead notification includes the visitor message', async () => {
  const { handleLead } = await import('../server/order.js')
  const sent = []
  const real = globalThis.fetch
  globalThis.fetch = async (_url, init) => { sent.push(JSON.parse(init.body).text); return { ok: true, text: async () => '' } }
  try {
    const res = await handleLead({ phone: '+7 900 123-45-67', name: 'Анна', comment: 'Нужен ПК для монтажа <4K>' }, { TELEGRAM_BOT_TOKEN: 'x', TELEGRAM_CHAT_ID: '1' })
    assert.equal(res.status, 200)
    assert.match(sent[0], /Нужен ПК для монтажа &lt;4K&gt;/)
  } finally {
    globalThis.fetch = real
  }
})

test('rating stats and filters', async () => {
  const { ratingStats, seedReviews, reviewWord } = await import('../src/data/reviews.js')
  const st = ratingStats([{ rating: 5 }, { rating: 4 }, { rating: 4 }])
  assert.equal(st.count, 3)
  assert.equal(st.avg.toFixed(2), '4.33')
  assert.deepEqual(st.dist, [1, 2, 0, 0, 0])
  assert.equal(ratingStats([], 4.2).avg, 4.2)
  assert.deepEqual([1, 2, 5, 11, 21].map(reviewWord), ['1 отзыв', '2 отзыва', '5 отзывов', '11 отзывов', '21 отзыв'])
  for (const p of products.filter((x) => x.group)) assert.ok(seedReviews[p.id]?.length >= 3, p.name)

  const { applyFilters, countFilters, DEFAULT_FILTERS } = await import('../src/data/filters.js')
  const shop = products.filter((p) => p.group)
  assert.equal(applyFilters(shop, DEFAULT_FILTERS).length, 12)
  assert.equal(countFilters(DEFAULT_FILTERS), 0)
  assert.ok(applyFilters(shop, { ...DEFAULT_FILTERS, max: '20000' }).every((p) => p.price <= 20000))
  assert.ok(applyFilters(shop, { ...DEFAULT_FILTERS, sale: true }).every((p) => p.old))
  assert.ok(applyFilters(shop, { ...DEFAULT_FILTERS, isNew: true }).every((p) => p.isNew))
  assert.equal(countFilters({ ...DEFAULT_FILTERS, min: '1', sale: true }), 2)
})
