import React, { useEffect, useMemo, useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TasksList from './components/TasksList.jsx'
import CalendarView from './components/CalendarView.jsx'
import AvailabilityPicker, { availabilityToBlocks } from './components/AvailabilityPicker.jsx'
import { WEEKLY_TASKS } from './data/recurringTasks.js'
import { dueDateFromWeekly } from './utils/date.js'
import { scheduleTasks } from './utils/scheduler.js'
import { load, save } from './utils/storage.js'
import { generateICS } from './export/icsExport.js'

function App() {
  const [adhocTasks, setAdhocTasks] = useState(() => load('adhocTasks', []))
  const [availabilityMap, setAvailabilityMap] = useState(() => load('availabilityMap', {}) || {})
  const [currentWeekBase, setCurrentWeekBase] = useState(new Date())

  useEffect(() => { save('adhocTasks', adhocTasks) }, [adhocTasks])
  useEffect(() => { save('availabilityMap', availabilityMap) }, [availabilityMap])

  function toggleAvailability(weekday, hour) {
    const key = `${weekday}-${hour}`
    setAvailabilityMap(m => ({ ...m, [key]: !m[key] }))
  }

  const weeklyTasksWithDates = useMemo(() => {
    return WEEKLY_TASKS.map(t => ({
      id: `${t.id}-${weekKey(currentWeekBase)}`,
      title: t.title,
      subject: t.subject,
      dueAt: dueDateFromWeekly(t, currentWeekBase),
      estMinutes: t.estMinutes,
      priority: t.priority,
      type: t.type
    }))
  }, [currentWeekBase])

  const allTasks = useMemo(() => [...weeklyTasksWithDates, ...adhocTasks], [weeklyTasksWithDates, adhocTasks])
  const availabilityBlocks = useMemo(() => availabilityToBlocks(availabilityMap, currentWeekBase), [availabilityMap, currentWeekBase])
  const { sessions, unscheduled } = useMemo(() => scheduleTasks(allTasks, availabilityBlocks.map(b => ({ ...b }))), [allTasks, availabilityBlocks])

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
        <p className="text-slate-600">Select your availability, add homework, and auto-schedule into free time.</p>
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
          {unscheduled.length > 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3">
              <div className="font-medium mb-1">Unscheduled (not enough free time)</div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {unscheduled.map(u => (
                  <li key={u.id}>{u.title} — {u.minutesLeft} mins left (due {new Date(u.dueAt).toLocaleString()})</li>
                ))}
              </ul>
              <p className="text-xs mt-1">Tip: add more availability or reduce estimates.</p>
            </div>
          )}
        </div>
      </div>

      <CalendarView sessions={sessions} deadlines={allTasks} />

      <footer className="text-center text-xs text-slate-500 py-4 no-print">
        Built for Torquay Academy • Weekly fixed tasks included
      </footer>
    </div>
  )
}

function weekKey(d) {
  const y = d.getFullYear()
  const start = new Date(d)
  start.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  const m = String(start.getMonth() + 1).padStart(2, '0')
  const day = String(start.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default App
