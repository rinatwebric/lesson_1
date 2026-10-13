export const SLOTS = [
  { id: 'cpu', cat: 'cpu', labelKey: 'cfg.slot.cpu', required: true },
  { id: 'motherboard', cat: 'motherboards', labelKey: 'cfg.slot.motherboard', required: true },
  { id: 'gpu', cat: 'gpu', labelKey: 'cfg.slot.gpu', required: false, noneKey: 'cfg.slot.gpuNone' },
  { id: 'ram', cat: 'ram', labelKey: 'cfg.slot.ram', required: true },
  { id: 'storage', cat: 'storage', labelKey: 'cfg.slot.storage', required: true, filter: (p) => p.compat?.m2 },
  { id: 'cooler', cat: 'cooling', labelKey: 'cfg.slot.cooler', required: true },
  { id: 'psu', cat: 'psu', labelKey: 'cfg.slot.psu', required: true },
  { id: 'case', cat: 'cases', labelKey: 'cfg.slot.case', required: true },
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
  // Messages are i18n keys with params; the UI translates them.
  const error = (slots, msg, vars) => issues.push({ level: 'error', slots, msg, vars })
  const warn = (slots, msg, vars) => issues.push({ level: 'warn', slots, msg, vars })

  if (cpu && mb && c(cpu).socket !== c(mb).socket) {
    error(['cpu', 'motherboard'], 'cfg.issue.socket', { cpu: c(cpu).socket, mb: c(mb).socket })
  }
  if (ram && mb && c(ram).memory !== c(mb).memory) {
    error(['ram', 'motherboard'], 'cfg.issue.memory', { ram: c(ram).memory, mb: c(mb).memory })
  }
  if (mb && pc && !c(pc).forms?.includes(c(mb).form)) {
    error(['motherboard', 'case'], 'cfg.issue.form', { form: c(mb).form, forms: c(pc).forms.join(', ') })
  }
  if (gpu && pc && c(gpu).length > c(pc).gpuMax) {
    error(['gpu', 'case'], 'cfg.issue.gpuLength', { len: c(gpu).length, max: c(pc).gpuMax })
  }
  if (cooler && cpu && !c(cooler).sockets?.includes(c(cpu).socket)) {
    error(['cooler', 'cpu'], 'cfg.issue.coolerSocket', { socket: c(cpu).socket })
  }
  if (cooler && pc && c(cooler).type === 'air' && c(cooler).height > c(pc).coolerMax) {
    error(['cooler', 'case'], 'cfg.issue.coolerHeight', { h: c(cooler).height, max: c(pc).coolerMax })
  }
  if (cooler && pc && c(cooler).type === 'aio' && !c(pc).radiators?.includes(c(cooler).radiator)) {
    error(['cooler', 'case'], 'cfg.issue.radiator', { r: c(cooler).radiator })
  }
  if (cooler && cpu && c(cooler).tdp < c(cpu).tdp) {
    warn(['cooler', 'cpu'], 'cfg.issue.coolerTdp', { tdp: c(cooler).tdp, cpu: c(cpu).tdp })
  }

  const load = powerLoad(parts)
  if (psu && load) {
    const watts = c(psu).watts
    const recommended = recommendedPsu(load)
    if (watts < load) {
      error(['psu', 'cpu', 'gpu'], 'cfg.issue.psuLow', { watts, load })
    } else if (watts < recommended) {
      warn(['psu'], 'cfg.issue.psuHeadroom', { rec: recommended })
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

const IGPU = { gaming: 12, work: 10 }
const RAM_GAMING = { 16: 70, 32: 90, 64: 100 }
const RAM_WORK = { 16: 40, 32: 70, 64: 100 }

// Rough 0-100 estimates from part ratings; null until a CPU is chosen.
export function scores(parts) {
  const { cpu, gpu, ram } = parts
  if (!cpu?.compat?.perf) return null
  const g = gpu?.compat?.perf ?? IGPU
  const gb = ram?.compat?.gb
  const gaming = 0.55 * g.gaming + 0.3 * cpu.compat.perf.gaming + 0.15 * (RAM_GAMING[gb] ?? 50)
  const work = 0.3 * g.work + 0.45 * cpu.compat.perf.work + 0.25 * (RAM_WORK[gb] ?? 30)
  return { gaming: Math.round(gaming), work: Math.round(work) }
}

export const PRESETS = [
  { id: 'gaming', nameKey: 'cfg.preset.gaming', noteKey: 'cfg.preset.gaming.note', parts: { cpu: 10, motherboard: 23, ram: 28, gpu: 7, storage: 16, psu: 32, case: 35, cooler: 38 } },
  { id: 'office', nameKey: 'cfg.preset.office', noteKey: 'cfg.preset.office.note', parts: { cpu: 12, motherboard: 24, ram: 27, storage: 41, psu: 31, case: 36, cooler: 38 } },
  { id: 'club', nameKey: 'cfg.preset.club', noteKey: 'cfg.preset.club.note', parts: { cpu: 11, motherboard: 25, ram: 28, gpu: 8, storage: 16, psu: 33, case: 35, cooler: 40 } },
  { id: 'max', nameKey: 'cfg.preset.max', noteKey: 'cfg.preset.max.note', parts: { cpu: 10, motherboard: 23, ram: 29, gpu: 9, storage: 17, psu: 34, case: 37, cooler: 40 } },
]
