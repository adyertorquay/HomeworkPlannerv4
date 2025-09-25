import { addMinutes, isBefore, compareAsc } from 'date-fns'

export function scheduleTasks(tasks, availability) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedTasks = [...tasks].sort((a, b) => {
    const c = compareAsc(a.dueAt, b.dueAt)
    if (c !== 0) return c
    return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
  })

  const free = [...availability].sort((a, b) => compareAsc(a.start, b.start))
  const sessions = []
  const unscheduled = []

  for (const t of sortedTasks) {
    let minutesLeft = t.estMinutes || 30
    for (const block of free) {
      if (minutesLeft <= 0) break
      const blockEnd = isBefore(block.end, t.dueAt) ? block.end : t.dueAt
      if (isBefore(blockEnd, block.start)) continue
      const blockMinutes = Math.max(0, (blockEnd - block.start) / 60000)
      if (blockMinutes <= 0) continue
      const use = Math.min(minutesLeft, blockMinutes)
      const start = block.start
      const end = addMinutes(start, use)
      sessions.push({ taskId: t.id, title: t.title, subject: t.subject, start, end, type: 'work' })
      block.start = end
      minutesLeft -= use
    }
    if (minutesLeft > 0) unscheduled.push({ ...t, minutesLeft })
  }
  return { sessions, unscheduled }
}