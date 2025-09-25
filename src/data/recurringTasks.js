// Hard-coded weekly tasks (appear every week)
export const WEEKLY_TASKS = [
  {
    id: 'weekly-mastery',
    title: 'Revision Mastery check',
    subject: 'Tutor',
    weekday: 1, // Monday
    dueHour: 9, // 09:00
    estMinutes: 30,
    priority: 'high',
    type: 'weekly-fixed'
  },
  {
    id: 'weekly-sparx-maths',
    title: 'Sparx Maths 100%',
    subject: 'Maths',
    weekday: 2, // Tuesday
    dueHour: 11,
    dueMinute: 30,
    estMinutes: 60,
    priority: 'high',
    type: 'weekly-fixed'
  },
  {
    id: 'weekly-sparx-science',
    title: 'Sparx Science 100%',
    subject: 'Science',
    weekday: 2, // Tuesday
    dueHour: 11,
    dueMinute: 30,
    estMinutes: 60,
    priority: 'high',
    type: 'weekly-fixed'
  },
  {
    id: 'weekly-reader',
    title: 'Sparx Reader 300 pts',
    subject: 'Reading',
    weekday: 4, // Thursday
    dueHour: 11,
    dueMinute: 30,
    estMinutes: 40,
    priority: 'medium',
    type: 'weekly-fixed'
  },
  {
    id: 'weekly-tassomai',
    title: 'Tassomai 500 pts',
    subject: 'Science',
    weekday: 4, // Thursday
    dueHour: 11,
    dueMinute: 30,
    estMinutes: 40,
    priority: 'medium',
    type: 'weekly-fixed'
  }
]

export const SUBJECT_COLOURS = {
  Maths: '#2563eb',
  Science: '#16a34a',
  English: '#dc2626',
  Geography: '#ea580c',
  History: '#7c3aed',
  Reading: '#0891b2',
  Tutor: '#64748b',
  Other: '#0ea5e9',
  Default: '#334155'
}
