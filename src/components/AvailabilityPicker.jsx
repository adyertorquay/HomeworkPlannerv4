import React from 'react'
import { addHours, startOfWeek, set, addDays } from 'date-fns'
import clsx from 'clsx'

function getAvailableHours(dayIndex) {
  if (dayIndex >= 0 && dayIndex <= 4) {
    // Mon–Fri: allow 06:00–08:00 and 15:00–20:00
    return [6,7,8,15,16,17,18,19,20]
  } else {
    // Sat–Sun: allow 09:00–20:00
    return [9,10,11,12,13,14,15,16,17,18,19,20]
  }
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function AvailabilityPicker({ availabilityMap, onToggle }) {
  const hoursToShow = Array.from({length: 21-6}, (_,i)=>i+6) // 06–20
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Select your available times</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-sm text-slate-500 px-2">Time</th>
              {DAYS.map(d => (<th key={d} className="text-sm text-slate-500 px-2">{d}</th>))}
            </tr>
          </thead>
          <tbody>
            {hoursToShow.map(h => (
              <tr key={h}>
                <td className="text-xs text-slate-500 px-2 w-16">{String(h).padStart(2,'0')}:00</td>
                {DAYS.map((_, idx) => {
                  const hours = getAvailableHours(idx)
                  if (!hours.includes(h)) return <td key={idx} className="px-2"></td>
                  const key = `${idx+1}-${h}`
                  const active = !!availabilityMap[key]
                  return (
                    <td key={key} className="px-2">
                      <button
                        className={clsx(
                          'w-20 h-8 rounded-lg border text-xs',
                          active ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        )}
                        onClick={() => onToggle(idx+1, h)}
                        aria-pressed={active}
                      >
                        {active ? 'Available' : 'Not set'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 mt-2">Click the times you’re free to do homework. Only those slots will be used in your plan.</p>
    </div>
  )
}

export function availabilityToBlocks(availabilityMap, baseDate = new Date()) {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 })
  const blocks = []
  for (const key of Object.keys(availabilityMap)) {
    if (!availabilityMap[key]) continue
    const [weekday, hour] = key.split('-').map(Number)
    const day = addDays(weekStart, weekday - 1)
    const start = set(day, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 })
    const end = addHours(start, 1)
    blocks.push({ start, end })
  }
  return blocks
}
