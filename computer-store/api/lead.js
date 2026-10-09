import { handleLead } from '../server/order.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }
  const { status, json } = await handleLead(req.body)
  res.status(status).json(json)
}
