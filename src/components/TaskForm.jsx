import React, { useState } from 'react'

const SUBJECTS = ['Maths','Science','English','Geography','History','Reading','Tutor','Other']

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('English')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('17:00')
  const [est, setEst] = useState(60)
  const [priority, setPriority] = useState('medium')

  function submit(e) {
    e.preventDefault()
    if (!title || !dueDate) return
    onAdd({
      id: crypto.randomUUID(),
      title,
      subject,
      dueAt: new Date(`${dueDate}T${dueTime}`),
      estMinutes: Number(est),
      priority,
      type: 'ad-hoc'
    })
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow p-4 space-y-3">
      <h3 className="text-lg font-semibold">Add a homework</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-600">Title</label>
          <input className="w-full border rounded-lg px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Geography essay"/>
        </div>
        <div>
          <label className="block text-sm text-slate-600">Subject</label>
          <select className="w-full border rounded-lg px-3 py-2" value={subject} onChange={e=>setSubject(e.target.value)}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-600">Due date</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Due time</label>
          <input type="time" className="w-full border rounded-lg px-3 py-2" value={dueTime} onChange={e=>setDueTime(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Estimated time (mins)</label>
          <input type="number" min="15" step="15" className="w-full border rounded-lg px-3 py-2" value={est} onChange={e=>setEst(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Priority</label>
          <select className="w-full border rounded-lg px-3 py-2" value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Add homework</button>
      </div>
    </form>
  )
}

export default TaskForm
