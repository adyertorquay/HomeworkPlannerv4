import React from 'react'

function TasksList({ tasks, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Your tasks</h3>
      {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks yet.</p>}
      <ul className="space-y-2">
        {tasks.map(t => (
          <li key={t.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
            <div>
              <div className="font-medium">{t.title} <span className="text-slate-400 text-sm">({t.subject})</span></div>
              <div className="text-xs text-slate-500">Due {new Date(t.dueAt).toLocaleString()} • {t.estMinutes} mins • {t.priority}</div>
            </div>
            {t.type === 'ad-hoc' && (
              <button onClick={()=>onDelete(t.id)} className="text-slate-500 hover:text-red-600 text-sm">Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TasksList
