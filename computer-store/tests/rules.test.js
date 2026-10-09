import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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
