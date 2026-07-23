import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'

type Tone = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  tone: Tone
}

type ToastApi = {
  push: (message: string, tone?: Tone) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const Ctx = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message: string, tone: Tone = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setItems((prev) => [...prev.slice(-3), { id, message, tone }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      push,
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
      info: (message) => push(message, 'info'),
    }),
    [push],
  )

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="no-print pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`eh-toast pointer-events-auto flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm shadow-lg backdrop-blur ${
              t.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : t.tone === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-950'
                  : 'border-slate-200 bg-white text-slate-800'
            }`}
          >
            {t.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : t.tone === 'error' ? (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
            )}
            <div className="flex-1 leading-5">{t.message}</div>
            <button
              type="button"
              className="rounded-md p-0.5 text-slate-400 hover:bg-black/5 hover:text-slate-700"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('ToastProvider missing')
  return ctx
}
