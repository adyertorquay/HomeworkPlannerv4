import { addMinutes, compareAsc } from 'date-fns'

export function scheduleTasks(tasks, availability) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  
  // Sort tasks: earliest deadline first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const deadlineDiff = compareAsc(a.dueAt, b.dueAt)
    if (deadlineDiff !== 0) return deadlineDiff
    return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
  })

  // Sort availability chronologically
  const free = [...availability].sort((a, b) => compareAsc(a.start, b.start))
  const sessions = []
  const unscheduled = []

  for (const task of sortedTasks) {
    let minutesLeft = task.estMinutes || 30

    for (const block of free) {
      // Only use blocks that start before the deadline
      if (block.start >= task.dueAt) continue

      const blockMinutes = (block.end - block.start) / 60000
      if (blockMinutes <= 0) continue

      const use = Math.min(minutesLeft, blockMinutes)
      const start = new Date(block.start)
      const end = addMinutes(start, use)

      // Save scheduled session
      sessions.push({
        taskId: task.id,
        title: task.title,
        subject: task.subject,
        start,
        end,
        type: 'work'
      })

      // Update block
      block.start = end
      minutesLeft -= use

      if (minutesLeft <= 0) break
    }

    if (minutesLeft > 0) {
      unscheduled.push({ ...task, minutesLeft })
    }
  }

  return { sessions, unscheduled }
}
