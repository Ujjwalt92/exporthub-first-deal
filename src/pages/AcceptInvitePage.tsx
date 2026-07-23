import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useToast } from '../components/Toast'
import { Button, Card, Field, Input } from '../components/ui'

export function AcceptInvitePage() {
  const { user, bootstrapping, acceptInvite } = useAuth()
  const [params] = useSearchParams()
  const [token, setToken] = useState(params.get('token') || '')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  if (bootstrapping) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading…</div>
  }
  if (!user) return <Navigate to={`/login`} replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await acceptInvite(token.trim())
      toast.success('Joined workspace')
      navigate('/app')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not accept invite')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-semibold">Accept team invite</h1>
        <p className="mt-2 text-sm text-slate-500">Signed in as {user.email}</p>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <Field label="Invite token">
            <Input required value={token} onChange={(e) => setToken(e.target.value)} />
          </Field>
          <Button className="w-full" disabled={busy}>
            {busy ? 'Joining…' : 'Join workspace'}
          </Button>
        </form>
        <Link to="/app" className="mt-4 inline-block text-sm text-teal-700 hover:underline">
          Back to dashboard
        </Link>
      </Card>
    </div>
  )
}
