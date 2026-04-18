import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, CalendarDays, Clock, CreditCard } from 'lucide-react'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

const initialStaff = {
  foh: [
    { id: 1, name: 'LJ Power',    role: 'Supervisor', timeIn: '07:00', timeOut: '17:00', isSupervisor: true },
    { id: 2, name: 'Megan R.',    role: 'Wait Staff',  timeIn: '08:00', timeOut: '15:30', cashTips: '', cashOut: '', ccTips: '' },
    { id: 3, name: 'Ashley T.',   role: 'Counter',     timeIn: '08:00', timeOut: '16:00' },
    { id: 4, name: 'Brittany K.', role: 'Wait Staff',  timeIn: '08:00', timeOut: '15:30', cashTips: '', cashOut: '', ccTips: '' },
    { id: 5, name: 'Dana M.',     role: 'Wait Staff',  timeIn: '08:00', timeOut: '15:30', cashTips: '', cashOut: '', ccTips: '' },
    { id: 6, name: 'Hostess',     role: 'Host',        timeIn: '08:00', timeOut: '15:30' },
  ],
  boh: [
    { id: 7,  name: 'Soup Chef',   role: 'Soup Chef',  timeIn: '07:00', timeOut: '15:00' },
    { id: 8,  name: 'Prep Cook',   role: 'Prep Cook',  timeIn: '07:00', timeOut: '15:00' },
    { id: 9,  name: 'Prep Cook 2', role: 'Prep Cook',  timeIn: '07:00', timeOut: '15:00' },
    { id: 10, name: 'Dishwasher',  role: 'Dishwasher', timeIn: '07:00', timeOut: '15:00' },
  ]
}

function calcHours(timeIn, timeOut) {
  if (!timeIn || !timeOut) return 0
  const [inH, inM] = timeIn.split(':').map(Number)
  const [outH, outM] = timeOut.split(':').map(Number)
  return Math.max(0, ((outH * 60 + outM) - (inH * 60 + inM)) / 60)
}

function calcNet(emp) {
  const cash = parseFloat(emp.cashTips) || 0
  const cashOut = parseFloat(emp.cashOut) || 0
  const cc = parseFloat(emp.ccTips) || 0
  return (cash - cashOut + cc).toFixed(2)
}

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const [staff, setStaff] = useState(initialStaff)
  const [saved, setSaved] = useState(false)
  const [override, setOverride] = useState(null) // { section, id } or null
  const [overrideForm, setOverrideForm] = useState({ timeIn: '', timeOut: '', note: '' })

  function updateFOH(id, field, value) {
    setStaff(s => ({ ...s, foh: s.foh.map(e => e.id === id ? { ...e, [field]: value } : e) }))
  }
  function updateBOH(id, field, value) {
    setStaff(s => ({ ...s, boh: s.boh.map(e => e.id === id ? { ...e, [field]: value } : e) }))
  }

  function openOverride(section, emp) {
    setOverride({ section, id: emp.id, name: emp.name, role: emp.role })
    setOverrideForm({ timeIn: emp.timeIn || '', timeOut: emp.timeOut || '', note: '' })
  }

  function applyOverride() {
    if (override.section === 'foh') {
      updateFOH(override.id, 'timeIn', overrideForm.timeIn)
      updateFOH(override.id, 'timeOut', overrideForm.timeOut)
    } else {
      updateBOH(override.id, 'timeIn', overrideForm.timeIn)
      updateBOH(override.id, 'timeOut', overrideForm.timeOut)
    }
    setOverride(null)
  }

  const allStaff = [...staff.foh, ...staff.boh]
  const totalHours = allStaff.reduce((sum, e) => sum + calcHours(e.timeIn, e.timeOut), 0)
  const totalCC = staff.foh.filter(e => e.ccTips !== undefined).reduce((sum, e) => sum + (parseFloat(e.ccTips) || 0), 0)
  const totalCash = staff.foh.filter(e => e.cashTips !== undefined).reduce((sum, e) => sum + (parseFloat(e.cashTips) || 0), 0)

  const inputStyle = { width: '100%', padding: '6px 8px', border: '1px solid #EDE6DA', borderRadius: 6, fontSize: 12, fontFamily: 'Montserrat, sans-serif', outline: 'none', textAlign: 'right', color: DARK }
  const timeStyle = { ...inputStyle, textAlign: 'center', width: 72 }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #A06535 !important; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        .row-hover:hover { background: rgba(160,101,53,0.03) !important; }
        .override-btn { background: transparent; border: 1px dashed #CCC; border-radius: 6px; padding: 3px 8px; font-size: 10px; color: #AAA; cursor: pointer; font-family: Montserrat, sans-serif; transition: all 0.2s; }
        .override-btn:hover { border-color: #A06535; color: #A06535; background: rgba(160,101,53,0.05); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #fff; border-radius: 16px; padding: 2rem; width: 400px; max-width: 90vw; box-shadow: 0 24px 64px rgba(0,0,0,0.2); }
      `}</style>

      {/* Header */}
      <div style={{ background: DARK, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid ' + COPPER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, color: COPPER }}>CD</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: '#fff' }}>Collective Dining</div>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Power's Restaurant · Manager View</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/cc-tips')} style={{ background: 'transparent', border: '1px solid rgba(217,195,163,0.2)', borderRadius: 6, padding: '7px 14px', fontSize: 11, color: 'rgba(217,195,163,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CreditCard size={13} /> CC Tips
          </button>
          <button onClick={() => navigate('/scheduler')} style={{ background: 'transparent', border: '1px solid rgba(217,195,163,0.2)', borderRadius: 6, padding: '7px 14px', fontSize: 11, color: 'rgba(217,195,163,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarDays size={13} /> Weekly Scheduler
          </button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>LJ Power</div>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.5)' }}>Supervisor</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>

        {/* Date + Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: DARK }}>Daily Timesheet & Tips</div>
            <div style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{today}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              ['Staff Today', allStaff.length, 'All staff'],
              ['Total Hours', totalHours.toFixed(1), 'Across all staff'],
              ['CC Tips', '$' + totalCC.toFixed(2), 'LJ enters below'],
              ['Cash Tips', '$' + totalCash.toFixed(2), 'Self-reported'],
            ].map(([label, val, sub]) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 90 }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: COPPER }}>{val}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: DARK, marginTop: 1 }}>{label}</div>
                <div style={{ fontSize: 9, color: '#8A9E8A', marginTop: 1 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOH Section */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(160,101,53,0.08)', padding: '10px 16px', borderBottom: '1px solid #EDE6DA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COPPER }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Front of House</div>
              <div style={{ fontSize: 11, color: SAGE }}>Wait staff & counter · roles may change daily</div>
            </div>
            <div style={{ fontSize: 10, color: SAGE, fontStyle: 'italic' }}>Click "Override" to fix a missed punch</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF8' }}>
                {['Employee', "Today's Role", 'Time In', 'Time Out', 'Hours', 'Cash Tips', 'Cash Out', 'CC Tips (LJ)', 'Net Taxable', ''].map(h => (
                  <th key={h} style={{ padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: h === 'Employee' || h === "Today's Role" ? 'left' : 'right', borderBottom: '1px solid #EDE6DA', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.foh.map((emp, i) => {
                const hrs = calcHours(emp.timeIn, emp.timeOut)
                const isTipped = emp.cashTips !== undefined
                return (
                  <tr key={emp.id} className="row-hover" style={{ background: i % 2 === 0 ? '#fff' : '#FDFCFB', borderBottom: '1px solid #F5F0E8' }}>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: DARK, whiteSpace: 'nowrap' }}>{emp.name}</td>
                    <td style={{ padding: '8px 10px' }}>
                      {emp.isSupervisor ? (
                        <span style={{ fontSize: 11, color: COPPER, fontWeight: 600 }}>Supervisor</span>
                      ) : (
                        <select value={emp.role} onChange={e => updateFOH(emp.id, 'role', e.target.value)}
                          style={{ fontSize: 11, border: '1px solid #EDE6DA', borderRadius: 6, padding: '4px 6px', fontFamily: 'Montserrat, sans-serif', color: DARK, background: '#fff', outline: 'none', cursor: 'pointer' }}>
                          <option>Wait Staff</option>
                          <option>Counter</option>
                          <option>Host</option>
                          <option>Busser</option>
                        </select>
                      )}
                    </td>
                    <td style={{ padding: '8px 6px' }}><input type="time" value={emp.timeIn} onChange={e => updateFOH(emp.id, 'timeIn', e.target.value)} style={timeStyle} /></td>
                    <td style={{ padding: '8px 6px' }}><input type="time" value={emp.timeOut} onChange={e => updateFOH(emp.id, 'timeOut', e.target.value)} style={timeStyle} /></td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: DARK, textAlign: 'right' }}>{hrs.toFixed(1)}h</td>
                    <td style={{ padding: '8px 6px' }}>{isTipped ? <input type="number" placeholder="0.00" value={emp.cashTips} onChange={e => updateFOH(emp.id, 'cashTips', e.target.value)} style={inputStyle} /> : <span style={{ fontSize: 11, color: '#CCC', display: 'block', textAlign: 'right' }}>-</span>}</td>
                    <td style={{ padding: '8px 6px' }}>{isTipped ? <input type="number" placeholder="0.00" value={emp.cashOut} onChange={e => updateFOH(emp.id, 'cashOut', e.target.value)} style={inputStyle} /> : <span style={{ fontSize: 11, color: '#CCC', display: 'block', textAlign: 'right' }}>-</span>}</td>
                    <td style={{ padding: '8px 6px' }}>{isTipped ? <input type="number" placeholder="0.00" value={emp.ccTips} onChange={e => updateFOH(emp.id, 'ccTips', e.target.value)} style={{ ...inputStyle, background: 'rgba(160,101,53,0.05)', borderColor: 'rgba(160,101,53,0.3)' }} /> : <span style={{ fontSize: 11, color: '#CCC', display: 'block', textAlign: 'right' }}>-</span>}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 700, color: isTipped ? COPPER : '#CCC', textAlign: 'right' }}>{isTipped ? '$' + calcNet(emp) : '-'}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                      <button className="override-btn" onClick={() => openOverride('foh', emp)}>
                        <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />Override
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* BOH Section */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(107,125,107,0.08)', padding: '10px 16px', borderBottom: '1px solid #EDE6DA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: SAGE }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Back of House</div>
            <div style={{ fontSize: 11, color: SAGE, opacity: 0.7 }}>Kitchen crew · time in/out only · hours sent to bookkeeper</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF8' }}>
                {['Employee', 'Role', 'Time In', 'Time Out', 'Hours', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: h === 'Employee' || h === 'Role' ? 'left' : 'center', borderBottom: '1px solid #EDE6DA' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.boh.map((emp, i) => {
                const hrs = calcHours(emp.timeIn, emp.timeOut)
                return (
                  <tr key={emp.id} className="row-hover" style={{ background: i % 2 === 0 ? '#fff' : '#FDFCFB', borderBottom: '1px solid #F5F0E8' }}>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: DARK }}>{emp.name}</td>
                    <td style={{ padding: '8px 10px', fontSize: 11, color: SAGE }}>{emp.role}</td>
                    <td style={{ padding: '8px 6px', textAlign: 'center' }}><input type="time" value={emp.timeIn} onChange={e => updateBOH(emp.id, 'timeIn', e.target.value)} style={timeStyle} /></td>
                    <td style={{ padding: '8px 6px', textAlign: 'center' }}><input type="time" value={emp.timeOut} onChange={e => updateBOH(emp.id, 'timeOut', e.target.value)} style={timeStyle} /></td>
                    <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: DARK, textAlign: 'center' }}>{hrs.toFixed(1)}h</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(107,125,107,0.1)', color: SAGE, fontWeight: 600 }}>→ Bookkeeper</span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                      <button className="override-btn" onClick={() => openOverride('boh', emp)}>
                        <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />Override
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Save Day */}
        <div style={{ background: DARK, borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>End of Day - Save & Submit</div>
            <div style={{ fontSize: 11, color: 'rgba(217,195,163,0.5)' }}>Hours go to bookkeeper · Tips recorded · Each waitress sees their summary</div>
          </div>
          <button onClick={() => setSaved(true)} style={{ background: COPPER, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> Save Day
          </button>
        </div>

        {saved && (
          <div style={{ marginTop: 12, background: 'rgba(74,124,89,0.1)', border: '1px solid #4A7C59', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 13, color: '#4A7C59', fontWeight: 600 }}>Day saved! Hours sent to bookkeeper. Tips recorded for all staff.</div>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {override && (
        <div className="modal-overlay" onClick={() => setOverride(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: DARK }}>Admin Clock Override</div>
                <div style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{override.name} · {override.role}</div>
              </div>
              <button onClick={() => setOverride(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20, color: '#AAA', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ background: 'rgba(160,101,53,0.06)', border: '1px solid rgba(160,101,53,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: '1.25rem', fontSize: 11, color: SAGE }}>
              Use this to correct a missed or incorrect punch. The override will be logged with today's date and your name as supervisor.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Time In</label>
                <input type="time" value={overrideForm.timeIn} onChange={e => setOverrideForm(f => ({ ...f, timeIn: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #EDE6DA', borderRadius: 8, fontSize: 14, fontFamily: 'Montserrat, sans-serif', outline: 'none', color: DARK }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Time Out</label>
                <input type="time" value={overrideForm.timeOut} onChange={e => setOverrideForm(f => ({ ...f, timeOut: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #EDE6DA', borderRadius: 8, fontSize: 14, fontFamily: 'Montserrat, sans-serif', outline: 'none', color: DARK }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Reason for Override (optional)</label>
              <input type="text" placeholder="e.g. Forgot to clock in, system error..." value={overrideForm.note}
                onChange={e => setOverrideForm(f => ({ ...f, note: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #EDE6DA', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat, sans-serif', outline: 'none', color: DARK }} />
            </div>

            {overrideForm.timeIn && overrideForm.timeOut && (
              <div style={{ background: '#F7F2EB', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: SAGE }}>Adjusted hours</span>
                <span style={{ fontWeight: 700, color: DARK }}>{Math.max(0, ((parseInt(overrideForm.timeOut.split(':')[0]) * 60 + parseInt(overrideForm.timeOut.split(':')[1] || 0)) - (parseInt(overrideForm.timeIn.split(':')[0]) * 60 + parseInt(overrideForm.timeIn.split(':')[1] || 0))) / 60).toFixed(1)}h</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setOverride(null)} style={{ flex: 1, background: 'transparent', border: '1px solid #EDE6DA', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', color: SAGE }}>Cancel</button>
              <button onClick={applyOverride} style={{ flex: 2, background: COPPER, color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Apply Override</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}