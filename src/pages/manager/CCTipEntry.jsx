import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

const WAIT_STAFF = [
  { id: 2, name: 'Megan R.' },
  { id: 4, name: 'Brittany K.' },
  { id: 5, name: 'Dana M.' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates(offset) {
  const start = new Date()
  start.setDate(start.getDate() - start.getDay() + 1 + offset * 7)
  return DAYS.map((day, i) => {
    const d = new Date(start.getTime() + i * 86400000)
    return { day, date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), full: d }
  })
}

function makeEmptyTips() {
  const tips = {}
  WAIT_STAFF.forEach(s => {
    tips[s.id] = {}
    DAYS.forEach(day => { tips[s.id][day] = '' })
  })
  return tips
}

export default function CCTipEntry() {
  const navigate = useNavigate()
  const [weekOffset, setWeekOffset] = useState(-1) // default to last week since entered end of week
  const [tips, setTips] = useState(makeEmptyTips())
  const [saved, setSaved] = useState(false)

  const weekDates = getWeekDates(weekOffset)
  const weekStart = weekDates[0].date
  const weekEnd = weekDates[6].date
  const weekYear = weekDates[6].full.getFullYear()

  function updateTip(staffId, day, value) {
    setTips(t => ({ ...t, [staffId]: { ...t[staffId], [day]: value } }))
  }

  function totalForPerson(staffId) {
    return DAYS.reduce((sum, day) => sum + (parseFloat(tips[staffId][day]) || 0), 0)
  }

  function totalForDay(day) {
    return WAIT_STAFF.reduce((sum, s) => sum + (parseFloat(tips[s.id][day]) || 0), 0)
  }

  function grandTotal() {
    return WAIT_STAFF.reduce((sum, s) => sum + totalForPerson(s.id), 0)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle = {
    width: '100%', padding: '8px 6px', border: '1px solid #EDE6DA', borderRadius: 6,
    fontSize: 13, fontFamily: 'Montserrat, sans-serif', outline: 'none',
    textAlign: 'right', color: DARK, background: '#fff'
  }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #A06535 !important; outline: none; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        .tip-input:focus { background: rgba(160,101,53,0.05) !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: DARK, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid ' + COPPER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, color: COPPER }}>CD</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: '#fff' }}>Weekly CC Tip Entry</div>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>JM Gerrish · LJ Power · Supervisor</div>
          </div>
        </div>
        <button onClick={() => navigate('/manager')} style={{ background: 'transparent', border: '1px solid rgba(217,195,163,0.2)', borderRadius: 6, padding: '7px 14px', fontSize: 11, color: 'rgba(217,195,163,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          Back to Daily View
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>

        {/* Instructions banner */}
        <div style={{ background: 'rgba(160,101,53,0.06)', border: '1px solid rgba(160,101,53,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <DollarSign size={18} color={COPPER} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COPPER, marginBottom: 4 }}>End of Week — Credit Card Tip Entry</div>
            <div style={{ fontSize: 11, color: SAGE, lineHeight: 1.6 }}>
              Enter the credit card tips for each waitress for each day this week. These amounts are pulled from your Aldelo POS reports.
              CC tips are paid out to each waitress in cash daily — enter what was earned each day, not what was already paid.
              All CC tips are taxable and will appear on each employee's end-of-shift summary.
            </div>
          </div>
        </div>

        {/* Week selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: DARK }}>CC Tips for Week</div>
            <div style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{weekStart} – {weekEnd}, {weekYear}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setWeekOffset(w => w - 1)} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} color={DARK} />
            </button>
            <button onClick={() => setWeekOffset(-1)} style={{ background: weekOffset === -1 ? COPPER : '#fff', color: weekOffset === -1 ? '#fff' : DARK, border: '1px solid ' + (weekOffset === -1 ? COPPER : '#EDE6DA'), borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Last Week</button>
            <button onClick={() => setWeekOffset(0)} style={{ background: weekOffset === 0 ? COPPER : '#fff', color: weekOffset === 0 ? '#fff' : DARK, border: '1px solid ' + (weekOffset === 0 ? COPPER : '#EDE6DA'), borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>This Week</button>
            <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} color={DARK} />
            </button>
          </div>
        </div>

        {/* Tip entry grid */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF8', borderBottom: '1px solid #EDE6DA' }}>
                <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', width: 140 }}>Waitress</th>
                {weekDates.map(({ day, date }) => (
                  <th key={day} style={{ padding: '12px 8px', fontSize: 10, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                    <div>{day}</div>
                    <div style={{ fontSize: 9, fontWeight: 400, color: '#B0B8C0', marginTop: 1 }}>{date}</div>
                  </th>
                ))}
                <th style={{ padding: '12px 12px', fontSize: 10, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {WAIT_STAFF.map((staff, idx) => (
                <tr key={staff.id} style={{ borderBottom: '1px solid #F5F0E8', background: idx % 2 === 0 ? '#fff' : '#FDFCFB' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{staff.name}</div>
                    <div style={{ fontSize: 10, color: SAGE }}>Wait Staff</div>
                  </td>
                  {DAYS.map(day => (
                    <td key={day} style={{ padding: '6px 4px', textAlign: 'center' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#CCC', pointerEvents: 'none' }}>$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={tips[staff.id][day]}
                          onChange={e => updateTip(staff.id, day, e.target.value)}
                          className="tip-input"
                          style={{ ...inputStyle, paddingLeft: 18, width: 80 }}
                        />
                      </div>
                    </td>
                  ))}
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: COPPER }}>
                      ${totalForPerson(staff.id).toFixed(2)}
                    </div>
                    <div style={{ fontSize: 9, color: '#8A9E8A', marginTop: 1 }}>this week</div>
                  </td>
                </tr>
              ))}

              {/* Day totals row */}
              <tr style={{ background: '#FAFAF8', borderTop: '2px solid #EDE6DA' }}>
                <td style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Total</td>
                {DAYS.map(day => (
                  <td key={day} style={{ padding: '10px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: totalForDay(day) > 0 ? DARK : '#CCC' }}>
                      {totalForDay(day) > 0 ? '$' + totalForDay(day).toFixed(2) : '-'}
                    </div>
                  </td>
                ))}
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: DARK }}>
                    ${grandTotal().toFixed(2)}
                  </div>
                  <div style={{ fontSize: 9, color: '#8A9E8A', marginTop: 1 }}>grand total</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Per-person summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {WAIT_STAFF.map(staff => (
            <div key={staff.id} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: DARK, marginBottom: 4 }}>{staff.name}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: COPPER, marginBottom: 4 }}>
                ${totalForPerson(staff.id).toFixed(2)}
              </div>
              <div style={{ fontSize: 10, color: SAGE }}>CC tips this week</div>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #F0EBE3' }}>
                {DAYS.map(day => (
                  tips[staff.id][day] ? (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: SAGE }}>{day}</span>
                      <span style={{ fontWeight: 600, color: DARK }}>${parseFloat(tips[staff.id][day]).toFixed(2)}</span>
                    </div>
                  ) : null
                ))}
                {DAYS.every(day => !tips[staff.id][day]) && (
                  <div style={{ fontSize: 10, color: '#CCC', fontStyle: 'italic' }}>No tips entered yet</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div style={{ background: DARK, borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Save Weekly CC Tips</div>
            <div style={{ fontSize: 11, color: 'rgba(217,195,163,0.5)' }}>Tips will be visible to each waitress on their next clock-out summary</div>
          </div>
          <button onClick={handleSave} style={{ background: saved ? '#4A7C59' : COPPER, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
            <Save size={16} /> {saved ? 'Saved!' : 'Save CC Tips'}
          </button>
        </div>

        {saved && (
          <div style={{ marginTop: 12, background: 'rgba(74,124,89,0.1)', border: '1px solid #4A7C59', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 13, color: '#4A7C59', fontWeight: 600 }}>CC tips saved! Megan, Brittany, and Dana will see their amounts on their next clock-out.</div>
          </div>
        )}
      </div>
    </div>
  )
}