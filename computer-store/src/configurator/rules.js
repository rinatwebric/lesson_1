export const SLOTS = [
  { id: 'cpu', cat: 'cpu', label: 'Процессор', required: true },
  { id: 'motherboard', cat: 'motherboards', label: 'Материнская плата', required: true },
  { id: 'ram', cat: 'ram', label: 'Оперативная память', required: true },
  { id: 'gpu', cat: 'gpu', label: 'Видеокарта', required: false, none: 'Без видеокарты (графика процессора)' },
  { id: 'storage', cat: 'storage', label: 'Накопитель M.2', required: true, filter: (p) => p.compat?.m2 },
  { id: 'psu', cat: 'psu', label: 'Блок питания', required: true },
  { id: 'case', cat: 'cases', label: 'Корпус', required: true },
  { id: 'cooler', cat: 'cooling', label: 'Охлаждение процессора', required: true },
]

const OTHER_LOAD_W = 100
const HEADROOM = 1.3

const c = (p) => p?.compat ?? {}
const roundUp50 = (n) => Math.ceil(n / 50) * 50

export function powerLoad(parts) {
  if (!parts.cpu) return null
  return (c(parts.cpu).tdp ?? 0) + (c(parts.gpu).power ?? 0) + OTHER_LOAD_W
}

export function recommendedPsu(load) {
  return roundUp50(load * HEADROOM)
}

// Each issue lists the slots it concerns, so a single option can be judged against the current build.
export function check(parts) {
  const { cpu, motherboard: mb, ram, gpu, psu, case: pc, cooler } = parts
  const issues = []
  const error = (slots, text) => issues.push({ level: 'error', slots, text })
  const warn = (slots, text) => issues.push({ level: 'warn', slots, text })

  if (cpu && mb && c(cpu).socket !== c(mb).socket) {
    error(['cpu', 'motherboard'], `Процессор с сокетом ${c(cpu).socket} не подходит к плате с сокетом ${c(mb).socket}.`)
  }
  if (ram && mb && c(ram).memory !== c(mb).memory) {
    error(['ram', 'motherboard'], `Память ${c(ram).memory} не подходит к плате, которая работает с ${c(mb).memory}.`)
  }
  if (mb && pc && !c(pc).forms?.includes(c(mb).form)) {
    error(['motherboard', 'case'], `Плата формата ${c(mb).form} не помещается в корпус (поддерживает: ${c(pc).forms.join(', ')}).`)
  }
  if (gpu && pc && c(gpu).length > c(pc).gpuMax) {
    error(['gpu', 'case'], `Видеокарта длиной ${c(gpu).length} мм не помещается в корпус (максимум ${c(pc).gpuMax} мм).`)
  }
  if (cooler && cpu && !c(cooler).sockets?.includes(c(cpu).socket)) {
    error(['cooler', 'cpu'], `Кулер не поддерживает сокет ${c(cpu).socket}.`)
  }
  if (cooler && pc && c(cooler).type === 'air' && c(cooler).height > c(pc).coolerMax) {
    error(['cooler', 'case'], `Кулер высотой ${c(cooler).height} мм не помещается в корпус (максимум ${c(pc).coolerMax} мм).`)
  }
  if (cooler && pc && c(cooler).type === 'aio' && !c(pc).radiators?.includes(c(cooler).radiator)) {
    error(['cooler', 'case'], `Радиатор ${c(cooler).radiator} мм не помещается в корпус.`)
  }
  if (cooler && cpu && c(cooler).tdp < c(cpu).tdp) {
    warn(['cooler', 'cpu'], `Кулер рассчитан на ${c(cooler).tdp} Вт, а процессор может потреблять до ${c(cpu).tdp} Вт. Возможен перегрев.`)
  }

  const load = powerLoad(parts)
  if (psu && load) {
    const watts = c(psu).watts
    const recommended = recommendedPsu(load)
    if (watts < load) {
      error(['psu', 'cpu', 'gpu'], `Блок питания ${watts} Вт слабее расчётной нагрузки ${load} Вт.`)
    } else if (watts < recommended) {
      warn(['psu'], `Мощности хватит, но запас маленький: рекомендуем блок от ${recommended} Вт.`)
    }
  }
  return issues
}

export function summarize(parts) {
  const issues = check(parts)
  const missing = SLOTS.filter((s) => s.required && !parts[s.id])
  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warn')
  const total = Object.values(parts).reduce((sum, p) => sum + (p?.price ?? 0), 0)
  const load = powerLoad(parts)
  return {
    issues, errors, warnings, missing, total, load,
    recommended: load ? recommendedPsu(load) : null,
    complete: !missing.length && !errors.length,
  }
}

// Errors that choosing `product` in `slotId` would cause with the rest of the build.
export function optionErrors(slotId, product, parts) {
  return check({ ...parts, [slotId]: product }).filter((i) => i.level === 'error' && i.slots.includes(slotId))
}

export const PRESETS = [
  { id: 'gaming', name: 'Игровой 1440p', note: 'Ryzen 7 7800X3D и RTX 4070 Super', parts: { cpu: 10, motherboard: 23, ram: 28, gpu: 7, storage: 16, psu: 32, case: 35, cooler: 38 } },
  { id: 'office', name: 'Офисный', note: 'Тихий и компактный, без видеокарты', parts: { cpu: 12, motherboard: 24, ram: 27, storage: 41, psu: 31, case: 36, cooler: 38 } },
  { id: 'club', name: 'Для ПК-клуба', note: 'Core i7 и RX 7800 XT, запас по питанию', parts: { cpu: 11, motherboard: 25, ram: 28, gpu: 8, storage: 16, psu: 33, case: 35, cooler: 40 } },
]
