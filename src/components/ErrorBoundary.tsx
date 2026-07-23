import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button, Card } from './ui'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ExportHub crash', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-lg p-6">
          <div className="text-lg font-semibold text-slate-900">Something went wrong</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Usually this is old demo data in the browser. Click reset and reload.
          </p>
          <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-rose-700">
            {this.state.error.message}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith('exporthub-'))
                  .forEach((k) => localStorage.removeItem(k))
                window.location.href = '/'
              }}
            >
              Reset local data & reload
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reload only
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}
