import type { TaskItem } from '../types'
import { Field, Input } from './ui'

export function TaskChecklist({
  tasks,
  onToggle,
  onNote,
  disabled,
}: {
  tasks: TaskItem[]
  onToggle: (id: string, done: boolean) => void
  onNote?: (id: string, note: string) => void
  disabled?: boolean
}) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-xl border border-slate-200 p-3">
          <label className="flex items-start gap-3 text-sm text-slate-800">
            <input
              type="checkbox"
              className="mt-1"
              disabled={disabled}
              checked={task.done}
              onChange={(e) => onToggle(task.id, e.target.checked)}
            />
            <span className={task.done ? 'line-through text-slate-400' : ''}>{task.label}</span>
          </label>
          {onNote ? (
            <div className="mt-2 pl-7">
              <Field label="Note">
                <Input
                  disabled={disabled}
                  value={task.note}
                  onChange={(e) => onNote(task.id, e.target.value)}
                  placeholder="Optional note"
                />
              </Field>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function GateBanner({
  blocked,
  message,
  okMessage,
}: {
  blocked: boolean
  message: string
  okMessage: string
}) {
  return blocked ? (
    <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
      {message}
    </div>
  ) : (
    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      {okMessage}
    </div>
  )
}
