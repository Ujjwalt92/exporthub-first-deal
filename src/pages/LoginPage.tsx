import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useToast } from '../components/Toast'
import { Button, Card, Field, Input } from '../components/ui'

export function LoginPage() {
  const { login, user, bootstrapping, mode } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (!bootstrapping && user) return <Navigate to="/app" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await login({ email, password })
      toast.success('Welcome back')
      navigate('/app')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in to ExportHub"
      subtitle="Access your cloud workspace, deals, and billing."
      mode={mode}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Work email">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Button className="w-full" size="lg" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        New here?{' '}
        <Link className="font-medium text-teal-700 hover:underline" to="/signup">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}

export function SignupPage() {
  const { register, user, bootstrapping, mode } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (!bootstrapping && user) return <Navigate to="/app" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await register({ name, email, password, companyName })
      toast.success('Workspace created')
      navigate('/app')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Start your export workspace"
      subtitle="Free plan includes 1 live deal. Upgrade anytime for unlimited deals and team seats."
      mode={mode}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Your name">
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ujjwal Tiwari" />
        </Field>
        <Field label="Company / trade name">
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Tiwari's Spices International" />
        </Field>
        <Field label="Work email">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </Field>
        <Field label="Password" hint="Minimum 8 characters">
          <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Button className="w-full" size="lg" disabled={busy}>
          {busy ? 'Creating…' : 'Create free workspace'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-medium text-teal-700 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

function AuthLayout({
  title,
  subtitle,
  mode,
  children,
}: {
  title: string
  subtitle: string
  mode: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-xs font-bold text-white">EH</div>
          <div className="text-sm font-semibold text-slate-900">ExportHub SaaS</div>
        </Link>
        <Card className="p-6 shadow-lg shadow-slate-900/5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
            Mode · {mode === 'cloud' ? 'Cloud API' : 'Local SaaS vault'}
          </div>
          <div className="mt-5">{children}</div>
        </Card>
      </div>
    </div>
  )
}
