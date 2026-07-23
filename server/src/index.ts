import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import {
  createSession,
  createWorkspaceForUser,
  dealLimit,
  getDb,
  hashPassword,
  persist,
  publicUser,
  seatLimit,
  userFromToken,
  verifyPassword,
  workspaceForUser,
  type PlanId,
} from './db.js'

const app = new Hono()

const ORIGINS = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return origin
      if (ORIGINS.includes('*')) return origin
      return ORIGINS.includes(origin) ? origin : ORIGINS[0] || origin
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
)

function bearer(c: { req: { header: (name: string) => string | undefined } }) {
  const header = c.req.header('authorization') || ''
  const m = header.match(/^Bearer\s+(.+)$/i)
  return m?.[1] ?? null
}

function authUser(c: { req: { header: (name: string) => string | undefined } }) {
  return userFromToken(bearer(c))
}

app.get('/health', (c) =>
  c.json({
    ok: true,
    service: 'exporthub-api',
    version: '1.0.0',
    time: new Date().toISOString(),
  }),
)

app.post('/auth/register', async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(2),
      companyName: z.string().optional(),
    })
    .safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid registration payload' }, 400)

  const email = parsed.data.email.trim().toLowerCase()
  const db = getDb()
  if (db.users.some((u) => u.email === email)) {
    return c.json({ error: 'Email already registered' }, 409)
  }

  const { hash, salt } = hashPassword(parsed.data.password)
  const user = {
    id: nanoid(),
    email,
    name: parsed.data.name.trim(),
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  persist()
  const { workspace } = createWorkspaceForUser(user, parsed.data.companyName)
  const session = createSession(user.id)

  return c.json({
    token: session.token,
    user: publicUser(user),
    workspace: publicWorkspace(workspace),
  })
})

app.post('/auth/login', async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = z
    .object({
      email: z.string().email(),
      password: z.string().min(1),
    })
    .safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid login payload' }, 400)

  const email = parsed.data.email.trim().toLowerCase()
  const db = getDb()
  const user = db.users.find((u) => u.email === email)
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash, user.passwordSalt)) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  let ctx = workspaceForUser(user.id)
  if (!ctx) ctx = createWorkspaceForUser(user)
  const session = createSession(user.id)

  return c.json({
    token: session.token,
    user: publicUser(user),
    workspace: publicWorkspace(ctx.workspace),
  })
})

app.post('/auth/logout', (c) => {
  const token = bearer(c)
  if (token) {
    const db = getDb()
    db.sessions = db.sessions.filter((s) => s.token !== token)
    persist()
  }
  return c.json({ ok: true })
})

app.get('/auth/me', (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  const db = getDb()
  const members = db.members
    .filter((m) => m.workspaceId === ctx.workspace.id)
    .map((m) => {
      const u = db.users.find((x) => x.id === m.userId)
      return {
        id: m.id,
        role: m.role,
        user: u ? publicUser(u) : null,
        createdAt: m.createdAt,
      }
    })

  return c.json({
    user: publicUser(user),
    workspace: publicWorkspace(ctx.workspace),
    membership: { role: ctx.membership.role },
    members,
    limits: {
      deals: dealLimit(ctx.workspace.plan),
      seats: seatLimit(ctx.workspace.plan),
    },
  })
})

app.get('/deals', (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  const deals = getDb()
    .deals.filter((d) => d.workspaceId === ctx.workspace.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(summarizeDeal)
  return c.json({ deals })
})

app.post('/deals', async (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)

  const db = getDb()
  const count = db.deals.filter((d) => d.workspaceId === ctx.workspace.id).length
  const limit = dealLimit(ctx.workspace.plan)
  if (count >= limit) {
    return c.json(
      {
        error: `Plan limit reached (${limit} deal${limit === 1 ? '' : 's'}). Upgrade to Founding or Pro.`,
        code: 'PLAN_LIMIT',
      },
      402,
    )
  }

  const body = await c.req.json().catch(() => ({}))
  const title =
    typeof body?.title === 'string' && body.title.trim()
      ? body.title.trim()
      : 'Teja S17 · UAE First Deal'
  const template = body?.data && typeof body.data === 'object' ? body.data : null
  const now = new Date().toISOString()
  const deal = {
    id: nanoid(),
    workspaceId: ctx.workspace.id,
    title,
    stage: (template as { stage?: string } | null)?.stage || 'inquiry',
    productName:
      (template as { productName?: string } | null)?.productName ||
      'Teja S17 Stemless Super Deluxe Red Chilli',
    buyerName: (template as { buyerName?: string } | null)?.buyerName || 'UAE Buyer',
    progressPct: 0,
    data: template,
    createdBy: user.id,
    createdAt: now,
    updatedAt: now,
  }
  db.deals.push(deal)
  persist()
  return c.json({ deal: summarizeDeal(deal) }, 201)
})

app.get('/deals/:id', (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  const deal = getDb().deals.find((d) => d.id === c.req.param('id') && d.workspaceId === ctx.workspace.id)
  if (!deal) return c.json({ error: 'Deal not found' }, 404)
  return c.json({ deal: fullDeal(deal) })
})

app.put('/deals/:id', async (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  const db = getDb()
  const deal = db.deals.find((d) => d.id === c.req.param('id') && d.workspaceId === ctx.workspace.id)
  if (!deal) return c.json({ error: 'Deal not found' }, 404)

  const body = await c.req.json().catch(() => null)
  if (!body || typeof body !== 'object') return c.json({ error: 'Invalid deal payload' }, 400)

  const data = (body as { data?: unknown }).data ?? body
  const meta = body as {
    title?: string
    progressPct?: number
  }

  deal.data = data
  deal.updatedAt = new Date().toISOString()
  if (typeof meta.title === 'string' && meta.title.trim()) deal.title = meta.title.trim()
  if (typeof meta.progressPct === 'number') deal.progressPct = Math.max(0, Math.min(100, meta.progressPct))

  const d = data as {
    stage?: string
    productName?: string
    buyerName?: string
  }
  if (d.stage) deal.stage = d.stage
  if (d.productName) deal.productName = d.productName
  if (d.buyerName) deal.buyerName = d.buyerName

  persist()
  return c.json({ deal: fullDeal(deal) })
})

app.delete('/deals/:id', (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  const db = getDb()
  const before = db.deals.length
  db.deals = db.deals.filter((d) => !(d.id === c.req.param('id') && d.workspaceId === ctx.workspace.id))
  if (db.deals.length === before) return c.json({ error: 'Deal not found' }, 404)
  persist()
  return c.json({ ok: true })
})

app.patch('/workspace', async (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  if (ctx.membership.role === 'member') return c.json({ error: 'Forbidden' }, 403)

  const body = await c.req.json().catch(() => null)
  const parsed = z.object({ name: z.string().min(2).max(80) }).safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid workspace name' }, 400)
  ctx.workspace.name = parsed.data.name.trim()
  persist()
  return c.json({ workspace: publicWorkspace(ctx.workspace) })
})

app.post('/workspace/plan', async (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  if (ctx.membership.role === 'member') return c.json({ error: 'Forbidden' }, 403)

  const body = await c.req.json().catch(() => null)
  const parsed = z
    .object({
      plan: z.enum(['free', 'founding', 'pro']),
      paymentRef: z.string().optional(),
    })
    .safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid plan' }, 400)

  // Demo checkout: accept plan change with optional payment reference.
  // Wire Razorpay/Stripe webhook here in production.
  ctx.workspace.plan = parsed.data.plan as PlanId
  ctx.workspace.planUpdatedAt = new Date().toISOString()
  persist()
  return c.json({
    workspace: publicWorkspace(ctx.workspace),
    message:
      parsed.data.plan === 'free'
        ? 'Downgraded to Free'
        : `Activated ${parsed.data.plan} plan${parsed.data.paymentRef ? ` · ref ${parsed.data.paymentRef}` : ''}`,
  })
})

app.post('/workspace/invites', async (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const ctx = workspaceForUser(user.id)
  if (!ctx) return c.json({ error: 'Workspace missing' }, 500)
  if (ctx.membership.role === 'member') return c.json({ error: 'Forbidden' }, 403)

  const db = getDb()
  const seats = db.members.filter((m) => m.workspaceId === ctx.workspace.id).length
  if (seats >= seatLimit(ctx.workspace.plan)) {
    return c.json({ error: 'Seat limit reached for your plan. Upgrade to add teammates.', code: 'SEAT_LIMIT' }, 402)
  }

  const body = await c.req.json().catch(() => null)
  const parsed = z
    .object({
      email: z.string().email(),
      role: z.enum(['admin', 'member']).optional(),
    })
    .safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid invite' }, 400)

  const email = parsed.data.email.trim().toLowerCase()
  const role = parsed.data.role || 'member'
  const existingUser = db.users.find((u) => u.email === email)
  if (existingUser && db.members.some((m) => m.workspaceId === ctx.workspace.id && m.userId === existingUser.id)) {
    return c.json({ error: 'User already in workspace' }, 409)
  }

  const invite = {
    id: nanoid(),
    workspaceId: ctx.workspace.id,
    email,
    role: role,
    token: nanoid(24),
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    acceptedAt: null as string | null,
  }
  db.invites.push(invite)
  persist()

  // If user already registered, auto-add them
  if (existingUser) {
    db.members.push({
      id: nanoid(),
      workspaceId: ctx.workspace.id,
      userId: existingUser.id,
      role: role,
      createdAt: new Date().toISOString(),
    })
    invite.acceptedAt = new Date().toISOString()
    // remove from any other workspace membership for MVP single-workspace users
    db.members = db.members.filter(
      (m) => !(m.userId === existingUser.id && m.workspaceId !== ctx.workspace.id),
    )
    persist()
  }

  return c.json({
    invite: {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      token: invite.token,
      acceptedAt: invite.acceptedAt,
      acceptPath: `/accept-invite?token=${invite.token}`,
    },
  })
})

app.post('/workspace/invites/accept', async (c) => {
  const user = authUser(c)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  const body = await c.req.json().catch(() => null)
  const parsed = z.object({ token: z.string().min(8) }).safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid token' }, 400)

  const db = getDb()
  const invite = db.invites.find((i) => i.token === parsed.data.token && !i.acceptedAt)
  if (!invite) return c.json({ error: 'Invite not found or already used' }, 404)
  if (invite.email !== user.email) {
    return c.json({ error: 'Invite email does not match your account' }, 403)
  }

  // Move user into invited workspace
  db.members = db.members.filter((m) => m.userId !== user.id)
  db.members.push({
    id: nanoid(),
    workspaceId: invite.workspaceId,
    userId: user.id,
    role: invite.role,
    createdAt: new Date().toISOString(),
  })
  invite.acceptedAt = new Date().toISOString()
  persist()

  const workspace = db.workspaces.find((w) => w.id === invite.workspaceId)!
  return c.json({ workspace: publicWorkspace(workspace) })
})

app.get('/billing/plans', (c) =>
  c.json({
    plans: [
      {
        id: 'free',
        name: 'Free',
        priceInr: 0,
        period: 'forever',
        deals: 1,
        seats: 1,
        features: ['1 live deal', 'Full First Deal OS playbook', 'JSON backup'],
      },
      {
        id: 'founding',
        name: 'Founding Trader',
        priceInr: 14999,
        period: 'one-time',
        deals: 1000,
        seats: 3,
        features: [
          'Unlimited deals',
          '3 team seats',
          'Cloud sync',
          'Founding price lock',
          'Priority onboarding scripts',
        ],
      },
      {
        id: 'pro',
        name: 'Pro Workspace',
        priceInr: 4999,
        period: 'month',
        deals: 1000,
        seats: 20,
        features: [
          'Unlimited deals',
          '20 team seats',
          'Cloud sync',
          'Ops + CHA collaboration',
          'Priority support',
        ],
      },
    ],
  }),
)

function publicWorkspace(workspace: {
  id: string
  name: string
  ownerId: string
  plan: PlanId
  planUpdatedAt: string
  createdAt: string
}) {
  return {
    id: workspace.id,
    name: workspace.name,
    plan: workspace.plan,
    planUpdatedAt: workspace.planUpdatedAt,
    createdAt: workspace.createdAt,
    limits: {
      deals: dealLimit(workspace.plan),
      seats: seatLimit(workspace.plan),
    },
  }
}

function summarizeDeal(deal: {
  id: string
  title: string
  stage: string
  productName: string
  buyerName: string
  progressPct: number
  createdAt: string
  updatedAt: string
}) {
  return {
    id: deal.id,
    title: deal.title,
    stage: deal.stage,
    productName: deal.productName,
    buyerName: deal.buyerName,
    progressPct: deal.progressPct,
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
  }
}

function fullDeal(deal: {
  id: string
  title: string
  stage: string
  productName: string
  buyerName: string
  progressPct: number
  data: unknown
  createdAt: string
  updatedAt: string
}) {
  return { ...summarizeDeal(deal), data: deal.data }
}

const port = Number(process.env.PORT || 8787)
console.log(`ExportHub API listening on :${port}`)
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })
