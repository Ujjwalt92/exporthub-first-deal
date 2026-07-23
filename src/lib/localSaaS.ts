import { nanoid } from './id'
import type { DealData } from '../types'
import type { BillingPlan, DealFull, DealSummary, MemberRow, PlanId, PublicUser, Workspace } from './api'

const LOCAL_KEY = 'exporthub-saas-local-v1'

type LocalDb = {
  users: {
    id: string
    email: string
    name: string
    password: string
    createdAt: string
  }[]
  workspaces: Workspace[]
  members: { id: string; workspaceId: string; userId: string; role: 'owner' | 'admin' | 'member'; createdAt: string }[]
  deals: DealFull[]
  sessions: { token: string; userId: string }[]
  invites: {
    id: string
    workspaceId: string
    email: string
    role: 'admin' | 'member'
    token: string
    acceptedAt: string | null
  }[]
}

function empty(): LocalDb {
  return { users: [], workspaces: [], members: [], deals: [], sessions: [], invites: [] }
}

function load(): LocalDb {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return empty()
    return { ...empty(), ...(JSON.parse(raw) as LocalDb) }
  } catch {
    return empty()
  }
}

function save(db: LocalDb) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(db))
}

function limits(plan: PlanId) {
  if (plan === 'free') return { deals: 1, seats: 1 }
  if (plan === 'founding') return { deals: 1000, seats: 3 }
  return { deals: 1000, seats: 20 }
}

function withLimits(ws: Omit<Workspace, 'limits'> & { limits?: Workspace['limits'] }): Workspace {
  return { ...ws, limits: limits(ws.plan) }
}

function publicUser(u: LocalDb['users'][number]): PublicUser {
  return { id: u.id, email: u.email, name: u.name, createdAt: u.createdAt }
}

export const localSaaS = {
  async register(body: { email: string; password: string; name: string; companyName?: string }) {
    const db = load()
    const email = body.email.trim().toLowerCase()
    if (db.users.some((u) => u.email === email)) throw Object.assign(new Error('Email already registered'), { status: 409 })
    const user = {
      id: nanoid(),
      email,
      name: body.name.trim(),
      password: body.password,
      createdAt: new Date().toISOString(),
    }
    const ws = withLimits({
      id: nanoid(),
      name: body.companyName?.trim() || `${body.name.split(' ')[0]}'s Export Desk`,
      plan: 'free',
      planUpdatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    })
    const token = nanoid(32)
    db.users.push(user)
    db.workspaces.push(ws)
    db.members.push({
      id: nanoid(),
      workspaceId: ws.id,
      userId: user.id,
      role: 'owner',
      createdAt: new Date().toISOString(),
    })
    db.sessions.push({ token, userId: user.id })
    save(db)
    return { token, user: publicUser(user), workspace: ws }
  },

  async login(body: { email: string; password: string }) {
    const db = load()
    const email = body.email.trim().toLowerCase()
    const user = db.users.find((u) => u.email === email && u.password === body.password)
    if (!user) throw Object.assign(new Error('Invalid email or password'), { status: 401 })
    let member = db.members.find((m) => m.userId === user.id)
    let workspace = member ? db.workspaces.find((w) => w.id === member!.workspaceId) : null
    if (!workspace) {
      workspace = withLimits({
        id: nanoid(),
        name: `${user.name.split(' ')[0]}'s Export Desk`,
        plan: 'free',
        planUpdatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      member = {
        id: nanoid(),
        workspaceId: workspace.id,
        userId: user.id,
        role: 'owner',
        createdAt: new Date().toISOString(),
      }
      db.workspaces.push(workspace)
      db.members.push(member)
    }
    const token = nanoid(32)
    db.sessions.push({ token, userId: user.id })
    save(db)
    return { token, user: publicUser(user), workspace: withLimits(workspace) }
  },

  async logout(token: string | null) {
    if (!token) return { ok: true }
    const db = load()
    db.sessions = db.sessions.filter((s) => s.token !== token)
    save(db)
    return { ok: true }
  },

  async me(token: string | null) {
    const ctx = requireCtx(token)
    const db = load()
    const members: MemberRow[] = db.members
      .filter((m) => m.workspaceId === ctx.workspace.id)
      .map((m) => {
        const u = db.users.find((x) => x.id === m.userId)
        return { id: m.id, role: m.role, user: u ? publicUser(u) : null, createdAt: m.createdAt }
      })
    return {
      user: publicUser(ctx.user),
      workspace: withLimits(ctx.workspace),
      membership: { role: ctx.member.role },
      members,
      limits: limits(ctx.workspace.plan),
    }
  },

  async listDeals(token: string | null) {
    const ctx = requireCtx(token)
    const db = load()
    const mine = db.deals.filter(
      (d) => (d as DealFull & { workspaceId?: string }).workspaceId === ctx.workspace.id,
    )
    return { deals: mine.map(summary).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) }
  },

  async createDeal(token: string | null, body?: { title?: string; data?: DealData }) {
    const ctx = requireCtx(token)
    const db = load()
    const count = db.deals.filter((d) => (d as DealFull & { workspaceId?: string }).workspaceId === ctx.workspace.id).length
    const lim = limits(ctx.workspace.plan).deals
    if (count >= lim) {
      throw Object.assign(new Error(`Plan limit reached (${lim} deal${lim === 1 ? '' : 's'}). Upgrade to Founding or Pro.`), {
        status: 402,
        code: 'PLAN_LIMIT',
      })
    }
    const now = new Date().toISOString()
    const deal: DealFull & { workspaceId: string } = {
      id: nanoid(),
      workspaceId: ctx.workspace.id,
      title: body?.title?.trim() || 'Teja S17 · UAE First Deal',
      stage: body?.data?.stage || 'inquiry',
      productName: body?.data?.productName || 'Teja S17 Stemless Super Deluxe Red Chilli',
      buyerName: body?.data?.buyerName || 'UAE Buyer',
      progressPct: 0,
      data: body?.data ?? null,
      createdAt: now,
      updatedAt: now,
    }
    db.deals.push(deal)
    save(db)
    return { deal: summary(deal) }
  },

  async getDeal(token: string | null, id: string) {
    const ctx = requireCtx(token)
    const deal = load().deals.find(
      (d) => d.id === id && (d as DealFull & { workspaceId?: string }).workspaceId === ctx.workspace.id,
    )
    if (!deal) throw Object.assign(new Error('Deal not found'), { status: 404 })
    return { deal }
  },

  async saveDeal(
    token: string | null,
    id: string,
    payload: { data: DealData; title?: string; progressPct?: number },
  ) {
    const ctx = requireCtx(token)
    const db = load()
    const deal = db.deals.find(
      (d) => d.id === id && (d as DealFull & { workspaceId?: string }).workspaceId === ctx.workspace.id,
    )
    if (!deal) throw Object.assign(new Error('Deal not found'), { status: 404 })
    deal.data = payload.data
    deal.updatedAt = new Date().toISOString()
    deal.stage = payload.data.stage
    deal.productName = payload.data.productName
    deal.buyerName = payload.data.buyerName
    if (payload.title) deal.title = payload.title
    if (typeof payload.progressPct === 'number') deal.progressPct = payload.progressPct
    save(db)
    return { deal }
  },

  async deleteDeal(token: string | null, id: string) {
    const ctx = requireCtx(token)
    const db = load()
    const before = db.deals.length
    db.deals = db.deals.filter(
      (d) => !(d.id === id && (d as DealFull & { workspaceId?: string }).workspaceId === ctx.workspace.id),
    )
    if (db.deals.length === before) throw Object.assign(new Error('Deal not found'), { status: 404 })
    save(db)
    return { ok: true }
  },

  async updateWorkspace(token: string | null, name: string) {
    const ctx = requireCtx(token)
    if (ctx.member.role === 'member') throw Object.assign(new Error('Forbidden'), { status: 403 })
    const db = load()
    const ws = db.workspaces.find((w) => w.id === ctx.workspace.id)!
    ws.name = name.trim()
    save(db)
    return { workspace: withLimits(ws) }
  },

  async changePlan(token: string | null, plan: PlanId, _paymentRef?: string) {
    const ctx = requireCtx(token)
    if (ctx.member.role === 'member') throw Object.assign(new Error('Forbidden'), { status: 403 })
    const db = load()
    const ws = db.workspaces.find((w) => w.id === ctx.workspace.id)!
    ws.plan = plan
    ws.planUpdatedAt = new Date().toISOString()
    save(db)
    return {
      workspace: withLimits(ws),
      message: plan === 'free' ? 'Downgraded to Free' : `Activated ${plan} plan`,
    }
  },

  async invite(token: string | null, email: string, role: 'admin' | 'member' = 'member') {
    const ctx = requireCtx(token)
    if (ctx.member.role === 'member') throw Object.assign(new Error('Forbidden'), { status: 403 })
    const db = load()
    const seats = db.members.filter((m) => m.workspaceId === ctx.workspace.id).length
    if (seats >= limits(ctx.workspace.plan).seats) {
      throw Object.assign(new Error('Seat limit reached for your plan. Upgrade to add teammates.'), {
        status: 402,
        code: 'SEAT_LIMIT',
      })
    }
    const invite = {
      id: nanoid(),
      workspaceId: ctx.workspace.id,
      email: email.trim().toLowerCase(),
      role,
      token: nanoid(24),
      acceptedAt: null as string | null,
    }
    const existing = db.users.find((u) => u.email === invite.email)
    if (existing) {
      db.members = db.members.filter((m) => m.userId !== existing.id)
      db.members.push({
        id: nanoid(),
        workspaceId: ctx.workspace.id,
        userId: existing.id,
        role,
        createdAt: new Date().toISOString(),
      })
      invite.acceptedAt = new Date().toISOString()
    }
    db.invites.push(invite)
    save(db)
    return {
      invite: {
        ...invite,
        acceptPath: `/accept-invite?token=${invite.token}`,
      },
    }
  },

  async acceptInvite(token: string | null, inviteToken: string) {
    const ctx = requireCtx(token)
    const db = load()
    const invite = db.invites.find((i) => i.token === inviteToken && !i.acceptedAt)
    if (!invite) throw Object.assign(new Error('Invite not found or already used'), { status: 404 })
    if (invite.email !== ctx.user.email) {
      throw Object.assign(new Error('Invite email does not match your account'), { status: 403 })
    }
    db.members = db.members.filter((m) => m.userId !== ctx.user.id)
    db.members.push({
      id: nanoid(),
      workspaceId: invite.workspaceId,
      userId: ctx.user.id,
      role: invite.role,
      createdAt: new Date().toISOString(),
    })
    invite.acceptedAt = new Date().toISOString()
    save(db)
    const workspace = db.workspaces.find((w) => w.id === invite.workspaceId)!
    return { workspace: withLimits(workspace) }
  },

  async plans(): Promise<{ plans: BillingPlan[] }> {
    return {
      plans: [
        {
          id: 'free',
          name: 'Free',
          priceInr: 0,
          period: 'forever',
          deals: 1,
          seats: 1,
          features: ['1 live deal', 'Full First Deal OS playbook', 'Local SaaS vault'],
        },
        {
          id: 'founding',
          name: 'Founding Trader',
          priceInr: 14999,
          period: 'one-time',
          deals: 1000,
          seats: 3,
          features: ['Unlimited deals', '3 team seats', 'Cloud sync when API connected', 'Founding price lock'],
        },
        {
          id: 'pro',
          name: 'Pro Workspace',
          priceInr: 4999,
          period: 'month',
          deals: 1000,
          seats: 20,
          features: ['Unlimited deals', '20 team seats', 'Team collaboration', 'Priority support'],
        },
      ],
    }
  },
}

function summary(deal: DealFull): DealSummary {
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

function requireCtx(token: string | null) {
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  const db = load()
  const session = db.sessions.find((s) => s.token === token)
  if (!session) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  const user = db.users.find((u) => u.id === session.userId)
  if (!user) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  const member = db.members.find((m) => m.userId === user.id)
  const workspace = member ? db.workspaces.find((w) => w.id === member.workspaceId) : null
  if (!member || !workspace) throw Object.assign(new Error('Workspace missing'), { status: 500 })
  return { user, member, workspace }
}
