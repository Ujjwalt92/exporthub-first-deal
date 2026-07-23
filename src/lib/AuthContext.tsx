import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getStoredToken } from './api'
import {
  detectSaaSMode,
  forceSaaSMode,
  getSaaSMode,
  saas,
  type DealSummary,
  type MemberRow,
  type PlanId,
  type PublicUser,
  type Workspace,
} from './saas'
import { createInitialDeal } from '../data/playbook'
import { dealProgress } from './costing'

type AuthState = {
  bootstrapping: boolean
  mode: 'cloud' | 'local'
  user: PublicUser | null
  workspace: Workspace | null
  role: 'owner' | 'admin' | 'member' | null
  members: MemberRow[]
  deals: DealSummary[]
  activeDealId: string | null
  register: (input: {
    email: string
    password: string
    name: string
    companyName?: string
  }) => Promise<void>
  login: (input: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  createDeal: (title?: string) => Promise<string>
  deleteDeal: (id: string) => Promise<void>
  setActiveDealId: (id: string | null) => void
  changePlan: (plan: PlanId) => Promise<string>
  inviteMember: (email: string, role?: 'admin' | 'member') => Promise<string>
  renameWorkspace: (name: string) => Promise<void>
  acceptInvite: (token: string) => Promise<void>
  switchMode: (mode: 'cloud' | 'local') => Promise<void>
}

const Ctx = createContext<AuthState | null>(null)
const ACTIVE_DEAL_KEY = 'exporthub-active-deal'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [bootstrapping, setBootstrapping] = useState(true)
  const [mode, setMode] = useState<'cloud' | 'local'>(getSaaSMode())
  const [user, setUser] = useState<PublicUser | null>(null)
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [role, setRole] = useState<'owner' | 'admin' | 'member' | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [deals, setDeals] = useState<DealSummary[]>([])
  const [activeDealId, setActiveDealIdState] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_DEAL_KEY),
  )

  const setActiveDealId = useCallback((id: string | null) => {
    setActiveDealIdState(id)
    if (id) localStorage.setItem(ACTIVE_DEAL_KEY, id)
    else localStorage.removeItem(ACTIVE_DEAL_KEY)
  }, [])

  const refresh = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null)
      setWorkspace(null)
      setRole(null)
      setMembers([])
      setDeals([])
      return
    }
    const me = await saas.me()
    setUser(me.user)
    setWorkspace(me.workspace)
    setRole(me.membership.role)
    setMembers(me.members)
    const listed = await saas.listDeals()
    setDeals(listed.deals)
    if (activeDealId && !listed.deals.some((d) => d.id === activeDealId)) {
      setActiveDealId(listed.deals[0]?.id ?? null)
    }
  }, [activeDealId, setActiveDealId])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const detected = await detectSaaSMode()
      if (cancelled) return
      setMode(detected)
      try {
        if (getStoredToken()) await refresh()
      } catch {
        // bad token
        await saas.logout().catch(() => undefined)
        setUser(null)
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const value = useMemo<AuthState>(
    () => ({
      bootstrapping,
      mode,
      user,
      workspace,
      role,
      members,
      deals,
      activeDealId,
      setActiveDealId,
      refresh,
      register: async (input) => {
        await saas.register(input)
        await refresh()
      },
      login: async (input) => {
        await saas.login(input)
        await refresh()
      },
      logout: async () => {
        await saas.logout()
        setUser(null)
        setWorkspace(null)
        setRole(null)
        setMembers([])
        setDeals([])
        setActiveDealId(null)
      },
      createDeal: async (title) => {
        const seed = createInitialDeal()
        const created = await saas.createDeal({ title, data: seed })
        const progress = dealProgress(seed)
        await saas.saveDeal(created.deal.id, {
          data: seed,
          title: created.deal.title,
          progressPct: progress.pct,
        })
        await refresh()
        setActiveDealId(created.deal.id)
        return created.deal.id
      },
      deleteDeal: async (id) => {
        await saas.deleteDeal(id)
        if (activeDealId === id) setActiveDealId(null)
        await refresh()
      },
      changePlan: async (plan) => {
        const res = await saas.changePlan(plan, `EH-${Date.now()}`)
        await refresh()
        return res.message
      },
      inviteMember: async (email, memberRole = 'member') => {
        const res = await saas.invite(email, memberRole)
        await refresh()
        return res.invite.token
      },
      renameWorkspace: async (name) => {
        await saas.updateWorkspace(name)
        await refresh()
      },
      acceptInvite: async (token) => {
        await saas.acceptInvite(token)
        await refresh()
      },
      switchMode: async (next) => {
        forceSaaSMode(next)
        setMode(next)
        await saas.logout().catch(() => undefined)
        setUser(null)
        setWorkspace(null)
        setDeals([])
        setActiveDealId(null)
      },
    }),
    [
      bootstrapping,
      mode,
      user,
      workspace,
      role,
      members,
      deals,
      activeDealId,
      setActiveDealId,
      refresh,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('AuthProvider missing')
  return ctx
}
