export const DEFAULT_FILTERS = { min: '', max: '', rating: 0, sale: false, isNew: false, hit: false }

export function countFilters(f) {
  return [f.min !== '', f.max !== '', f.rating > 0, f.sale, f.isNew, f.hit].filter(Boolean).length
}

export function applyFilters(list, f, ratingOf = (p) => p.rating) {
  const min = f.min === '' ? 0 : Number(f.min)
  const max = f.max === '' ? Infinity : Number(f.max)
  return list.filter((p) =>
    p.price >= min && p.price <= max &&
    ratingOf(p) >= f.rating &&
    (!f.sale || p.old) && (!f.isNew || p.isNew) && (!f.hit || p.badge === 'Хит'))
}
