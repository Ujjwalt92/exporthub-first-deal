import { api, getPreferredMode, getStoredToken, healthCheck, setPreferredMode, setStoredToken } from './api'
import type { BillingPlan, DealFull, DealSummary, MemberRow, PlanId, PublicUser, Workspace } from './api'
import { localSaaS } from './localSaaS'
import type { DealData } from '../types'

export type { BillingPlan, DealFull, DealSummary, MemberRow, PlanId, PublicUser, Workspace }

type Mode = 'cloud' | 'local'

let mode: Mode = getPreferredMode()

export function getSaaSMode() {
  return mode
}

export async function detectSaaSMode(): Promise<Mode> {
  const preferred = getPreferredMode()
  if (preferred === 'local') {
    mode = 'local'
    return mode
  }
  const ok = await healthCheck()
  mode = ok ? 'cloud' : 'local'
  return mode
}

export function forceSaaSMode(next: Mode) {
  mode = next
  setPreferredMode(next)
}

async function withClient<T>(cloudFn: () => Promise<T>, localFn: () => Promise<T>): Promise<T> {
  if (mode === 'local') return localFn()
  try {
    return await cloudFn()
  } catch (e) {
    if (e instanceof Error && e.message === 'NO_API') {
      mode = 'local'
      return localFn()
    }
    throw e
  }
}

export const saas = {
  async register(body: { email: string; password: string; name: string; companyName?: string }) {
    const res = await withClient(
      () => api.register(body),
      () => localSaaS.register(body),
    )
    setStoredToken(res.token)
    return res
  },
  async login(body: { email: string; password: string }) {
    const res = await withClient(
      () => api.login(body),
      () => localSaaS.login(body),
    )
    setStoredToken(res.token)
    return res
  },
  async logout() {
    const token = getStoredToken()
    try {
      await withClient(
        () => api.logout(),
        () => localSaaS.logout(token),
      )
    } finally {
      setStoredToken(null)
    }
  },
  async me() {
    const token = getStoredToken()
    return withClient(
      () => api.me(),
      () => localSaaS.me(token),
    )
  },
  async listDeals() {
    const token = getStoredToken()
    return withClient(
      () => api.listDeals(),
      () => localSaaS.listDeals(token),
    )
  },
  async createDeal(body?: { title?: string; data?: DealData }) {
    const token = getStoredToken()
    return withClient(
      () => api.createDeal(body),
      () => localSaaS.createDeal(token, body),
    )
  },
  async getDeal(id: string) {
    const token = getStoredToken()
    return withClient(
      () => api.getDeal(id),
      () => localSaaS.getDeal(token, id),
    )
  },
  async saveDeal(id: string, payload: { data: DealData; title?: string; progressPct?: number }) {
    const token = getStoredToken()
    return withClient(
      () => api.saveDeal(id, payload),
      () => localSaaS.saveDeal(token, id, payload),
    )
  },
  async deleteDeal(id: string) {
    const token = getStoredToken()
    return withClient(
      () => api.deleteDeal(id),
      () => localSaaS.deleteDeal(token, id),
    )
  },
  async updateWorkspace(name: string) {
    const token = getStoredToken()
    return withClient(
      () => api.updateWorkspace(name),
      () => localSaaS.updateWorkspace(token, name),
    )
  },
  async changePlan(plan: PlanId, paymentRef?: string) {
    const token = getStoredToken()
    return withClient(
      () => api.changePlan(plan, paymentRef),
      () => localSaaS.changePlan(token, plan, paymentRef),
    )
  },
  async invite(email: string, role: 'admin' | 'member' = 'member') {
    const token = getStoredToken()
    return withClient(
      () => api.invite(email, role),
      () => localSaaS.invite(token, email, role),
    )
  },
  async acceptInvite(inviteToken: string) {
    const token = getStoredToken()
    return withClient(
      () => api.acceptInvite(inviteToken),
      () => localSaaS.acceptInvite(token, inviteToken),
    )
  },
  async plans() {
    return withClient(
      () => api.plans(),
      () => localSaaS.plans(),
    )
  },
}
