import type { DealData } from '../types'

const TOKEN_KEY = 'exporthub-saas-token'
const MODE_KEY = 'exporthub-saas-mode'
const API_URL_KEY = 'exporthub-api-url'

export type PlanId = 'free' | 'founding' | 'pro'

export type PublicUser = {
  id: string
  email: string
  name: string
  createdAt: string
}

export type Workspace = {
  id: string
  name: string
  plan: PlanId
  planUpdatedAt: string
  createdAt: string
  limits: { deals: number; seats: number }
}

export type DealSummary = {
  id: string
  title: string
  stage: string
  productName: string
  buyerName: string
  progressPct: number
  createdAt: string
  updatedAt: string
}

export type DealFull = DealSummary & { data: DealData | null }

export type MemberRow = {
  id: string
  role: 'owner' | 'admin' | 'member'
  user: PublicUser | null
  createdAt: string
}

export type BillingPlan = {
  id: PlanId
  name: string
  priceInr: number
  period: string
  deals: number
  seats: number
  features: string[]
}

function apiBase() {
  const runtime = localStorage.getItem(API_URL_KEY)
  if (runtime && runtime.trim()) return runtime.replace(/\/$/, '')
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined
  if (fromEnv && fromEnv.trim()) return fromEnv.replace(/\/$/, '')
  return ''
}

export function getApiBase() {
  return apiBase()
}

export function setApiBase(url: string | null) {
  if (!url || !url.trim()) localStorage.removeItem(API_URL_KEY)
  else localStorage.setItem(API_URL_KEY, url.trim().replace(/\/$/, ''))
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (!token) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, token)
}

export function getPreferredMode(): 'cloud' | 'local' {
  const m = localStorage.getItem(MODE_KEY)
  return m === 'local' ? 'local' : 'cloud'
}

export function setPreferredMode(mode: 'cloud' | 'local') {
  localStorage.setItem(MODE_KEY, mode)
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const base = apiBase()
  if (!base && getPreferredMode() === 'cloud') {
    // no API configured — caller should use local adapter
    throw new Error('NO_API')
  }
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json')
  const token = options.token === undefined ? getStoredToken() : options.token
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${base}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error((data as { error?: string }).error || `Request failed (${res.status})`)
    ;(err as Error & { status?: number; code?: string }).status = res.status
    ;(err as Error & { status?: number; code?: string }).code = (data as { code?: string }).code
    throw err
  }
  return data as T
}

export async function healthCheck() {
  const base = apiBase()
  if (!base) return false
  try {
    const res = await fetch(`${base}/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}

export const api = {
  register: (body: { email: string; password: string; name: string; companyName?: string }) =>
    request<{ token: string; user: PublicUser; workspace: Workspace }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
      token: null,
    }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: PublicUser; workspace: Workspace }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      token: null,
    }),
  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),
  me: () =>
    request<{
      user: PublicUser
      workspace: Workspace
      membership: { role: 'owner' | 'admin' | 'member' }
      members: MemberRow[]
      limits: { deals: number; seats: number }
    }>('/auth/me'),
  listDeals: () => request<{ deals: DealSummary[] }>('/deals'),
  createDeal: (body?: { title?: string; data?: DealData }) =>
    request<{ deal: DealSummary }>('/deals', { method: 'POST', body: JSON.stringify(body || {}) }),
  getDeal: (id: string) => request<{ deal: DealFull }>(`/deals/${id}`),
  saveDeal: (id: string, payload: { data: DealData; title?: string; progressPct?: number }) =>
    request<{ deal: DealFull }>(`/deals/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteDeal: (id: string) => request<{ ok: boolean }>(`/deals/${id}`, { method: 'DELETE' }),
  updateWorkspace: (name: string) =>
    request<{ workspace: Workspace }>('/workspace', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),
  changePlan: (plan: PlanId, paymentRef?: string) =>
    request<{ workspace: Workspace; message: string }>('/workspace/plan', {
      method: 'POST',
      body: JSON.stringify({ plan, paymentRef }),
    }),
  invite: (email: string, role: 'admin' | 'member' = 'member') =>
    request<{
      invite: {
        id: string
        email: string
        role: string
        token: string
        acceptedAt: string | null
        acceptPath: string
      }
    }>('/workspace/invites', { method: 'POST', body: JSON.stringify({ email, role }) }),
  acceptInvite: (token: string) =>
    request<{ workspace: Workspace }>('/workspace/invites/accept', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  plans: () => request<{ plans: BillingPlan[] }>('/billing/plans', { token: null }),
}
