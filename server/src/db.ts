import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { nanoid } from 'nanoid'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR || join(__dirname, '..', 'data')
const dbPath = join(dataDir, 'exporthub.json')

export type PlanId = 'free' | 'founding' | 'pro'

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}

export interface Workspace {
  id: string
  name: string
  ownerId: string
  plan: PlanId
  planUpdatedAt: string
  createdAt: string
}

export interface Member {
  id: string
  workspaceId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  createdAt: string
}

export interface DealRecord {
  id: string
  workspaceId: string
  title: string
  stage: string
  productName: string
  buyerName: string
  progressPct: number
  data: unknown
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Invite {
  id: string
  workspaceId: string
  email: string
  role: 'admin' | 'member'
  token: string
  createdBy: string
  createdAt: string
  acceptedAt: string | null
}

export interface Session {
  token: string
  userId: string
  createdAt: string
  expiresAt: string
}

export interface Database {
  users: User[]
  workspaces: Workspace[]
  members: Member[]
  deals: DealRecord[]
  invites: Invite[]
  sessions: Session[]
}

function emptyDb(): Database {
  return { users: [], workspaces: [], members: [], deals: [], invites: [], sessions: [] }
}

let db: Database = emptyDb()

function ensureDb(): Database {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify(db, null, 2))
    return db
  }
  try {
    return JSON.parse(readFileSync(dbPath, 'utf8')) as Database
  } catch {
    writeFileSync(dbPath, JSON.stringify(db, null, 2))
    return db
  }
}

db = ensureDb()

export function persist(next?: Database) {
  if (next) db = next
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  const tmp = `${dbPath}.${process.pid}.tmp`
  writeFileSync(tmp, JSON.stringify(db, null, 2))
  renameSync(tmp, dbPath)
}

export function getDb() {
  return db
}

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex')
  return { hash, salt }
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const next = scryptSync(password, salt, 64)
  const prev = Buffer.from(hash, 'hex')
  if (next.length !== prev.length) return false
  return timingSafeEqual(next, prev)
}

export function createSession(userId: string) {
  const token = nanoid(48)
  const now = Date.now()
  const session: Session = {
    token,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 1000 * 60 * 60 * 24 * 30).toISOString(),
  }
  db.sessions.push(session)
  // prune expired
  db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > now)
  persist()
  return session
}

export function userFromToken(token: string | undefined | null) {
  if (!token) return null
  const session = db.sessions.find((s) => s.token === token)
  if (!session) return null
  if (new Date(session.expiresAt).getTime() < Date.now()) return null
  return db.users.find((u) => u.id === session.userId) ?? null
}

export function publicUser(user: User) {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
}

export function workspaceForUser(userId: string) {
  const membership = db.members.find((m) => m.userId === userId)
  if (!membership) return null
  const workspace = db.workspaces.find((w) => w.id === membership.workspaceId)
  if (!workspace) return null
  return { workspace, membership }
}

export function dealLimit(plan: PlanId) {
  if (plan === 'free') return 1
  return 1000
}

export function seatLimit(plan: PlanId) {
  if (plan === 'free') return 1
  if (plan === 'founding') return 3
  return 20
}

export function createWorkspaceForUser(user: User, companyName?: string) {
  const now = new Date().toISOString()
  const workspace: Workspace = {
    id: nanoid(),
    name: companyName?.trim() || `${user.name.split(' ')[0]}'s Export Desk`,
    ownerId: user.id,
    plan: 'free',
    planUpdatedAt: now,
    createdAt: now,
  }
  const member: Member = {
    id: nanoid(),
    workspaceId: workspace.id,
    userId: user.id,
    role: 'owner',
    createdAt: now,
  }
  db.workspaces.push(workspace)
  db.members.push(member)
  persist()
  return { workspace, member }
}

export function fingerprint(input: string) {
  return createHash('sha256').update(input).digest('hex').slice(0, 12)
}
