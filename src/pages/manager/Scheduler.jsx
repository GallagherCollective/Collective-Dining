import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

const ROLES = ['Wait Staff', 'Counter', 'Host', 'Busser', 'Supervisor', 'Soup Chef', 'Prep Cook', 'Dishwasher', 'Off']
const ROLE_COLORS = {
  'Wait Staff':  { bg: 'rgba(160,101,53,0.12)',  border: '#A06535', text: '#7A4E2A' },
  'Counter':     { bg: 'rgba(107,125,107,0.12)', border: '#6B7D6B', text: '#4A5E4A' },
  'Host':        { bg: 'rgba(74,124,89,0.12)',   border: '#4A7C59', text: '#2E5E40' },
  'Busser':      { bg: 'rgba(90,100,140,0.12)',  border: '#5A648C', text: '#3A4470' },
  'Supervisor':  { bg: 'rgba(43,43,43,0.08)',    border: '#2B2B2B', text: '#2B2B2B' },
  'Soup Chef':   { bg: 'rgba(140,90,60,0.12)',   border: '#8C5A3C', text: '#6B3E25' },
  'Prep Cook':   { bg: 'rgba(160,130,80,0.12)',  border: '#A08250', text: '#7A6035' },
  'Dishwasher':  { bg: 'rgba(100,100,100,0.12)', border: '#646464', text: '#464646' },
  'Off':         { bg: 'rgba(200,200,200,0.1)',  border: '#DDD',    text: '#AAA' },
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DEFAULT_TIMES = { start: '08:00', end: '16:00' }

const initialStaff = [
  { id: 1, name: 'LJ Power',    section: 'FOH', defaultRole: 'Supervisor' },
  { id: 2, name: 'Megan R.',    section: 'FOH', defaultRole: 'Wait Staff' },
  { id: 3, name: 'Ashley T.',   section: 'FOH', defaultRole: 'Counter' },
  { id: 4, name: 'Brittany K.', section: 'FOH', defaultRole: 'Wait Staff' },
  { id: 5, name: 'Dana M.',     section: 'FOH', defaultRole: 'Wait Staff' },
  { id: 6, name: 'Hostess',     section: 'FOH', defaultRole: 'Host' },
  { id: 7, name: 'Soup Chef',   section: 'BOH', defaultRole: 'Soup Chef' },
  { id: 8, name: 'Prep Cook',   section: 'BOH', defaultRole: 'Prep Cook' },
  { id: 9, name: 'Prep Cook 2', section: 'BOH', defaultRole: 'Prep Cook' },
  { id: 10, name: 'Dishwasher', section: 'BOH', defaultRole: 'Dishwasher' },
]

function makeInitialSchedule() {
  const s = {}
  initialStaff.forEach(emp => {
    s[emp.id] = {}
    DAYS.forEach(day => {
      s[emp.id][day] = { role: emp.defaultRole, start: '08:00', end: '16:00', scheduled: true }
    })
  })
  // Set Sunday off for most
  initialStaff.forEach(emp => {
    s[emp.id]['Sun'] = { role: 'Off', start: '', end: '', scheduled: false }
  })
  return s
}

export default function Scheduler() {
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState(makeInitialSchedule())
  const [weekOffset, setWeekOffset] = useState(0)
  const [editing, setEditing] = useState(null) // { empId, day }
  const [saved, setSaved] = useState(false)
  const [published, setPublished] = useState(false)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + weekOffset * 7)
  const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ' – ' +
    new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  function updateCell(empId, day, field, value) {
    setSchedule(s => ({
      ...s,
      [empId]: { ...s[empId], [day]: { ...s[empId][day], [field]: value } }
    }))
  }

  function toggleOff(empId, day) {
    const current = schedule[empId][day]
    if (current.role === 'Off') {
      const emp = initialStaff.find(e => e.id === empId)
      updateCell(empId, day, 'role', emp.defaultRole)
      updateCell(empId, day, 'start', '08:00')
      updateCell(empId, day, 'end', '16:00')
      updateCell(empId, day, 'scheduled', true)
    } else {
      setSchedule(s => ({
        ...s,
        [empId]: { ...s[empId], [day]: { role: 'Off', start: '', end: '', scheduled: false } }
      }))
    }
  }

  function calcHours(start, end) {
    if (!start || !end) return 0
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    return Math.max(0, ((eh * 60 + em) - (sh * 60 + sm)) / 60)
  }

  function totalWeekHours(empId) {
    return DAYS.reduce((sum, day) => {
      const cell = schedule[empId][day]
      return sum + calcHours(cell.start, cell.end)
    }, 0)
  }

  const fohStaff = initialStaff.filter(e => e.section === 'FOH')
  const bohStaff = initialStaff.filter(e => e.section === 'BOH')

  const cellStyle = (empId, day) => {
    const cell = schedule[empId]?.[day]
    if (!cell || cell.role === 'Off') return { background: 'rgba(200,200,200,0.08)', border: '1px solid #EDE6DA' }
    const colors = ROLE_COLORS[cell.role] || ROLE_COLORS['Wait Staff']
    return { background: colors.bg, border: '1px solid ' + colors.border }
  }

  const isEditing = (empId, day) => editing?.empId === empId && editing?.day === day

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cell { border-radius: 8px; padding: 6px 8px; cursor: pointer; transition: all 0.15s; min-height: 56px; }
        .cell:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(43,43,43,0.1); }
        select, input[type=time] { font-family: Montserrat, sans-serif; font-size: 10px; border: 1px solid #EDE6DA; border-radius: 4px; padding: 2px 4px; background: #fff; outline: none; }
        .section-header { background: rgba(160,101,53,0.06); padding: 8px 12px; border-bottom: 1px solid #EDE6DA; display: flex; align-items: center; gap: 8px; }
      `}</style>

      {/* Header */}
      <div style={{ background: DARK, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid ' + COPPER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, color: COPPER }}>CD</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: '#fff' }}>Shift Scheduler</div>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Power's Restaurant · Manager View</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/manager')} style={{ background: 'transparent', border: '1px solid rgba(217,195,163,0.2)', borderRadius: 6, padding: '7px 14px', fontSize: 11, color: 'rgba(217,195,163,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Daily View</button>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} style={{ background: COPPER, color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={13} /> {saved ? 'Saved!' : 'Save Draft'}
          </button>
          <button onClick={() => setPublished(true)} style={{ background: published ? '#4A7C59' : '#fff', color: published ? '#fff' : COPPER, border: '1px solid ' + (published ? '#4A7C59' : COPPER), borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Eye size={13} /> {published ? 'Published!' : 'Publish Schedule'}
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', overflowX: 'auto' }}>

        {/* Week navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: DARK }}>Weekly Schedule</div>
            <div style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{weekLabel}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {published && (
              <div style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(74,124,89,0.1)', border: '1px solid #4A7C59', borderRadius: 20, color: '#4A7C59', fontWeight: 600 }}>
                Schedule Published — Staff can view
              </div>
            )}
            <button onClick={() => setWeekOffset(w => w - 1)} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} color={DARK} />
            </button>
            <button onClick={() => setWeekOffset(0)} style={{ background: weekOffset === 0 ? COPPER : '#fff', color: weekOffset === 0 ? '#fff' : DARK, border: '1px solid ' + (weekOffset === 0 ? COPPER : '#EDE6DA'), borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>This Week</button>
            <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} color={DARK} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {Object.entries(ROLE_COLORS).filter(([r]) => r !== 'Off').map(([role, colors]) => (
            <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: colors.bg, border: '1px solid ' + colors.border }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.border }} />
              <span style={{ fontSize: 10, color: colors.text, fontWeight: 600 }}>{role}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: 'rgba(200,200,200,0.1)', border: '1px solid #DDD' }}>
            <span style={{ fontSize: 10, color: '#AAA', fontWeight: 600 }}>Off</span>
          </div>
        </div>

        {/* Schedule table */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, overflow: 'hidden', minWidth: 900 }}>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 60px repeat(7, 1fr)', background: '#FAFAF8', borderBottom: '1px solid #EDE6DA' }}>
            <div style={{ padding: '10px 12px', fontSize: 10, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Employee</div>
            <div style={{ padding: '10px 8px', fontSize: 10, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Hrs</div>
            {DAYS.map((day, i) => {
              const date = new Date(weekStart.getTime() + i * 86400000)
              const isToday = date.toDateString() === new Date().toDateString()
              return (
                <div key={day} style={{ padding: '10px 6px', textAlign: 'center', background: isToday ? 'rgba(160,101,53,0.06)' : 'transparent' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? COPPER : DARK }}>{day}</div>
                  <div style={{ fontSize: 9, color: isToday ? COPPER : '#8A9E8A' }}>{date.getDate()}</div>
                </div>
              )
            })}
          </div>

          {/* FOH Section */}
          <div className="section-header">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COPPER }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Front of House</div>
          </div>
          {fohStaff.map((emp, idx) => (
            <div key={emp.id} style={{ display: 'grid', gridTemplateColumns: '160px 60px repeat(7, 1fr)', borderBottom: '1px solid #F5F0E8', background: idx % 2 === 0 ? '#fff' : '#FDFCFB' }}>
              <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{emp.name}</div>
                <div style={{ fontSize: 10, color: SAGE }}>{emp.defaultRole}</div>
              </div>
              <div style={{ padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COPPER }}>{totalWeekHours(emp.id).toFixed(0)}h</div>
              </div>
              {DAYS.map(day => {
                const cell = schedule[emp.id]?.[day]
                const colors = cell?.role !== 'Off' ? (ROLE_COLORS[cell?.role] || ROLE_COLORS['Wait Staff']) : null
                return (
                  <div key={day} style={{ padding: '4px' }}>
                    <div className="cell" style={cellStyle(emp.id, day)} onClick={() => setEditing(isEditing(emp.id, day) ? null : { empId: emp.id, day })}>
                      {cell?.role === 'Off' ? (
                        <div style={{ textAlign: 'center', paddingTop: 8 }}>
                          <div style={{ fontSize: 10, color: '#CCC', fontWeight: 500 }}>Off</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: colors?.text, marginBottom: 2 }}>{cell?.role}</div>
                          <div style={{ fontSize: 9, color: colors?.text, opacity: 0.8 }}>{cell?.start} – {cell?.end}</div>
                        </div>
                      )}
                      {isEditing(emp.id, day) && (
                        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }} onClick={e => e.stopPropagation()}>
                          <select value={cell?.role} onChange={e => updateCell(emp.id, day, 'role', e.target.value)} style={{ width: '100%' }}>
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                          </select>
                          {cell?.role !== 'Off' && <>
                            <input type="time" value={cell?.start} onChange={e => updateCell(emp.id, day, 'start', e.target.value)} style={{ width: '100%' }} />
                            <input type="time" value={cell?.end} onChange={e => updateCell(emp.id, day, 'end', e.target.value)} style={{ width: '100%' }} />
                          </>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          {/* BOH Section */}
          <div className="section-header" style={{ background: 'rgba(107,125,107,0.06)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: SAGE }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Back of House</div>
          </div>
          {bohStaff.map((emp, idx) => (
            <div key={emp.id} style={{ display: 'grid', gridTemplateColumns: '160px 60px repeat(7, 1fr)', borderBottom: '1px solid #F5F0E8', background: idx % 2 === 0 ? '#fff' : '#FDFCFB' }}>
              <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{emp.name}</div>
                <div style={{ fontSize: 10, color: SAGE }}>{emp.defaultRole}</div>
              </div>
              <div style={{ padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: SAGE }}>{totalWeekHours(emp.id).toFixed(0)}h</div>
              </div>
              {DAYS.map(day => {
                const cell = schedule[emp.id]?.[day]
                const colors = cell?.role !== 'Off' ? (ROLE_COLORS[cell?.role] || ROLE_COLORS['Prep Cook']) : null
                return (
                  <div key={day} style={{ padding: '4px' }}>
                    <div className="cell" style={cellStyle(emp.id, day)} onClick={() => setEditing(isEditing(emp.id, day) ? null : { empId: emp.id, day })}>
                      {cell?.role === 'Off' ? (
                        <div style={{ textAlign: 'center', paddingTop: 8 }}>
                          <div style={{ fontSize: 10, color: '#CCC', fontWeight: 500 }}>Off</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: colors?.text, marginBottom: 2 }}>{cell?.role}</div>
                          <div style={{ fontSize: 9, color: colors?.text, opacity: 0.8 }}>{cell?.start} – {cell?.end}</div>
                        </div>
                      )}
                      {isEditing(emp.id, day) && (
                        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }} onClick={e => e.stopPropagation()}>
                          <select value={cell?.role} onChange={e => updateCell(emp.id, day, 'role', e.target.value)} style={{ width: '100%' }}>
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                          </select>
                          {cell?.role !== 'Off' && <>
                            <input type="time" value={cell?.start} onChange={e => updateCell(emp.id, day, 'start', e.target.value)} style={{ width: '100%' }} />
                            <input type="time" value={cell?.end} onChange={e => updateCell(emp.id, day, 'end', e.target.value)} style={{ width: '100%' }} />
                          </>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: '1.25rem' }}>
          {[
            ['Total Staff', initialStaff.length, 'Scheduled this week'],
            ['FOH Hours', fohStaff.reduce((sum, e) => sum + totalWeekHours(e.id), 0).toFixed(0) + 'h', 'Front of house total'],
            ['BOH Hours', bohStaff.reduce((sum, e) => sum + totalWeekHours(e.id), 0).toFixed(0) + 'h', 'Back of house total'],
            ['Total Hours', initialStaff.reduce((sum, e) => sum + totalWeekHours(e.id), 0).toFixed(0) + 'h', 'All staff combined'],
          ].map(([label, val, sub]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: COPPER }}>{val}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DARK, marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: '#8A9E8A', marginTop: 1 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}