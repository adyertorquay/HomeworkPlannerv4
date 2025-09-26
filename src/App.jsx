import React, { useEffect, useMemo, useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TasksList from './components/TasksList.jsx'
import CalendarView from './components/CalendarView.jsx'
import AvailabilityPicker, { availabilityToBlocks } from './components/AvailabilityPicker.jsx'
import { WEEKLY_TASKS } from './data/recurringTasks.js'
import { dueDateFromWeekly } from './utils/date.js'
import { load, save } from './utils/storage.js'
import { generateICS } from './export/icsExport.js'
import { addDays, startOfWeek, endOfWeek, isBefore, format } from 'date-fns'

function App() {
  const [adhocTasks, setAdhocTasks] = useState(() => load('adhocTasks', []))
  const [availabilityMap, setAvailabilityMap] = useState(() => load('availabilityMap', {}) || {})

  useEffect(() => { save('adhocTasks', adhocTasks) }, [adhocTasks])
  useEffect(() => { save('availabilityMap', availabilityMap) }, [availabilityMap])

  function toggleAvailability(weekday, hour) {
    const key = `${weekday}-${hour}`
    setAvailabilityMap(m => ({ ...m, [key]: !m[key] }))
  }

  // This week’s range
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  // Generate recurring tasks just for THIS week
  const weeklyTasksThisWeek = useMemo(() => {
    return WEEKLY_TASKS.map(t => ({
      id: `${t.id}-${format(weekStart, 'yyyy-MM-dd')}`,
      title: t.title,
      subject: t.subject,
      dueAt: dueDateFromWeekly(t, weekStart),
      estMinutes: t.estMinutes,
      priority: t.priority,
      type: t.type
    }))
  }, [weekStart])

  // Merge recurring + adhoc
  const allTasks = useMemo(() => {
    return [...weeklyTasksThisWeek, ...adhocTasks].filter(
      t => t.dueAt >= weekStart && t.dueAt <= weekEnd
    )
  }, [weeklyTasksThisWeek, adhocTasks, weekStart, weekEnd])

  // Simplified scheduling: 1 task = 1 block, max 2 per day
  const availabilityBlocks = useMemo(() => availabilityToBlocks(availabilityMap, weekStart), [availabilityMap, weekStart])

  const sessions = useMemo(() => {
    const dayCount = {}
    const result = []

    // sort tasks by deadline
    const sorted = [...allTasks].sort((a, b) => a.dueAt - b.dueAt)

    for (const task of sorted) {
      // find first available block before deadline
      const block = availabilityBlocks.find(b =>
        b.start < task.dueAt &&
        (dayCount[format(b.start, 'yyyy-MM-dd')] || 0) < 2
      )
      if (!block) continue

      const dayKey = format(block.start, 'yyyy-MM-dd')
      dayCount[dayKey] = (dayCount[dayKey] || 0) + 1

      result.push({
        taskId: task.id,
        title: `${task.title} (${task.estMinutes} mins)`,
        subject: task.subject,
        start: block.start,
        end: block.end,
        type: 'work'
      })
    }

    return result
  }, [allTasks, availabilityBlocks])

  function addTask(t) { setAdhocTasks(a => [...a, t]) }
  function deleteTask(id) { setAdhocTasks(a => a.filter(x => x.id !== id)) }

  function downloadICS() {
    try {
      const ics = generateICS(sessions, allTasks)
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'homework-planner.ics'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Could not export calendar: ' + e.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
      <header className="no-print">
        <h1 className="text-2xl md:text-3xl font-bold">Homework Planner</h1>
        <p className="text-slate-600">Plan your homework for this week in simple steps.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-4 no-print">
        <div className="md:col-span-2 space-y-4">
          <TaskForm onAdd={addTask} />
          <AvailabilityPicker availabilityMap={availabilityMap} onToggle={toggleAvailability} />
          <div className="flex gap-2">
            <button onClick={downloadICS} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Export .ics</button>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-800">Print / PDF</button>
          </div>
        </div>
        <div>
          <TasksList tasks={allTasks} onDelete={deleteTask} />
        </div>
      </div>

      <CalendarView sessions={sessions} deadlines={allTasks} />

      <footer className="text-center text-xs text-slate-500 py-4 no-print">
        Built for Torquay Academy • Weekly planner view
      </footer>
    </div>
  )
}

export default App
