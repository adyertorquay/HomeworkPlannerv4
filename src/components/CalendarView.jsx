import React, { useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { SUBJECT_COLOURS } from '../data/recurringTasks'

const locales = { 'en-GB': undefined }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: (d)=>startOfWeek(d,{weekStartsOn:1}), getDay, locales })

function CalendarView({ sessions, deadlines }) {
  const events = useMemo(() => {
    const A = sessions.map(s => ({
      title: `📝 ${s.title} (${s.subject})`,
      start: s.start,
      end: s.end,
      allDay: false,
      resource: { kind: 'work', subject: s.subject }
    }))
    const B = deadlines.map(d => ({
      title: `⏰ DUE: ${d.title} (${d.subject})`,
      start: d.dueAt,
      end: d.dueAt,
      allDay: false,
      resource: { kind: 'deadline', subject: d.subject }
    }))
    return [...A, ...B]
  }, [sessions, deadlines])

  function eventStyleGetter(event) {
    const kind = event.resource?.kind
    const colour = SUBJECT_COLOURS[event.resource?.subject] || SUBJECT_COLOURS.Default
    const bg = kind === 'deadline' ? '#ef4444' : colour
    return { style: { backgroundColor: bg, borderRadius: '8px', border: 'none', color: 'white', padding: '2px 4px' } }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-3">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 640 }}
        eventPropGetter={eventStyleGetter}
        popup
      />
    </div>
  )
}

export default CalendarView
