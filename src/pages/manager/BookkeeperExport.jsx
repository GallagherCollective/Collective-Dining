import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates(offset) {
  const start = new Date()
  start.setDate(start.getDate() - start.getDay() + 1 + offset * 7)
  return DAYS.map((day, i) => {
    const d = new Date(start.getTime() + i * 86400000)
    return { day, date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), full: d }
  })
}

const DEMO_DATA = {
  foh: [
    { id: 1, name: 'LJ Power',    role: 'Supervisor', hours: { Mon: 10, Tue: 10, Wed: 10, Thu: 10, Fri: 10, Sat: 10, Sun: 0 }, tips: null },
    { id: 2, name: 'Megan R.',    role: 'Wait Staff',  hours: { Mon: 7.5, Tue: 7.5, Wed: 7.5, Thu: 7.5, Fri: 7.5, Sat: 7.5, Sun: 0 }, tips: { Mon: { cash: 24, cashOut: 5, cc: 18, tipOut: 8 }, Tue: { cash: 18, cashOut: 5, cc: 22, tipOut: 5 }, Wed: { cash: 30, cashOut: 5, cc: 25, tipOut: 10 }, Thu: { cash: 20, cashOut: 5, cc: 15, tipOut: 5 }, Fri: { cash: 35, cashOut: 5, cc: 30, tipOut: 12 }, Sat: { cash: 40, cashOut: 5, cc: 35, tipOut: 15 }, Sun: null } },
    { id: 3, name: 'Ashley T.',   role: 'Counter',     hours: { Mon: 8, Tue: 8, Wed: 8, Thu: 8, Fri: 8, Sat: 8, Sun: 0 }, tips: null },
    { id: 4, name: 'Brittany K.', role: 'Wait Staff',  hours: { Mon: 7.5, Tue: 7.5, Wed: 7.5, Thu: 7.5, Fri: 7.5, Sat: 7.5, Sun: 0 }, tips: { Mon: { cash: 20, cashOut: 5, cc: 15, tipOut: 5 }, Tue: { cash: 22, cashOut: 5, cc: 18, tipOut: 6 }, Wed: { cash: 28, cashOut: 5, cc: 22, tipOut: 8 }, Thu: { cash: 18, cashOut: 5, cc: 14, tipOut: 4 }, Fri: { cash: 32, cashOut: 5, cc: 28, tipOut: 10 }, Sat: { cash: 38, cashOut: 5, cc: 32, tipOut: 12 }, Sun: null } },
    { id: 5, name: 'Dana M.',     role: 'Wait Staff',  hours: { Mon: 7.5, Tue: 7.5, Wed: 0, Thu: 7.5, Fri: 7.5, Sat: 7.5, Sun: 0 }, tips: { Mon: { cash: 18, cashOut: 5, cc: 14, tipOut: 4 }, Tue: { cash: 20, cashOut: 5, cc: 16, tipOut: 5 }, Wed: null, Thu: { cash: 16, cashOut: 5, cc: 12, tipOut: 3 }, Fri: { cash: 28, cashOut: 5, cc: 24, tipOut: 8 }, Sat: { cash: 35, cashOut: 5, cc: 30, tipOut: 10 }, Sun: null } },
    { id: 6, name: 'Hostess',     role: 'Host',        hours: { Mon: 7.5, Tue: 7.5, Wed: 7.5, Thu: 7.5, Fri: 7.5, Sat: 7.5, Sun: 0 }, tips: null },
  ],
  boh: [
    { id: 7,  name: 'Soup Chef',   role: 'Soup Chef',  hours: { Mon: 8, Tue: 8, Wed: 8, Thu: 8, Fri: 8, Sat: 8, Sun: 0 } },
    { id: 8,  name: 'Prep Cook',   role: 'Prep Cook',  hours: { Mon: 8, Tue: 8, Wed: 8, Thu: 8, Fri: 8, Sat: 8, Sun: 0 } },
    { id: 9,  name: 'Prep Cook 2', role: 'Prep Cook',  hours: { Mon: 8, Tue: 8, Wed: 8, Thu: 8, Fri: 8, Sat: 8, Sun: 0 } },
    { id: 10, name: 'Dishwasher',  role: 'Dishwasher', hours: { Mon: 8, Tue: 8, Wed: 8, Thu: 8, Fri: 8, Sat: 8, Sun: 0 } },
  ]
}

function calcNet(tip) {
  if (!tip) return 0
  return (tip.cash - tip.cashOut + tip.cc - tip.tipOut)
}

function totalHours(emp) {
  return DAYS.reduce((sum, day) => sum + (emp.hours[day] || 0), 0)
}

function generateCSV(weekDates, weekLabel) {
  const rows = []
  const dateHeaders = weekDates.map(w => w.date)

  rows.push(["JM GERRISH — WEEKLY PAYROLL EXPORT"])
  rows.push(['Week:', weekLabel])
  rows.push(['Generated:', new Date().toLocaleDateString()])
  rows.push([])

  // FOH Hours
  rows.push(['--- FRONT OF HOUSE ---'])
  rows.push(['Employee', 'Role', ...dateHeaders, 'Total Hours'])
  DEMO_DATA.foh.forEach(emp => {
    rows.push([
      emp.name, emp.role,
      ...DAYS.map(day => emp.hours[day] || 0),
      totalHours(emp)
    ])
  })
  rows.push([])

  // BOH Hours
  rows.push(['--- BACK OF HOUSE ---'])
  rows.push(['Employee', 'Role', ...dateHeaders, 'Total Hours'])
  DEMO_DATA.boh.forEach(emp => {
    rows.push([
      emp.name, emp.role,
      ...DAYS.map(day => emp.hours[day] || 0),
      totalHours(emp)
    ])
  })
  rows.push([])

  // Tip Summary
  rows.push(['--- TIP SUMMARY (WAIT STAFF ONLY) ---'])
  rows.push(['Employee', 'Day', 'Cash Tips', 'Cash Out', 'CC Tips', 'Tip Out', 'Net Taxable Tips'])
  DEMO_DATA.foh.filter(e => e.tips).forEach(emp => {
    DAYS.forEach(day => {
      const tip = emp.tips[day]
      if (tip) {
        rows.push([
          emp.name, day,
          tip.cash.toFixed(2),
          tip.cashOut.toFixed(2),
          tip.cc.toFixed(2),
          tip.tipOut.toFixed(2),
          calcNet(tip).toFixed(2)
        ])
      }
    })
    // Weekly total row
    const weekTotal = DAYS.reduce((sum, day) => sum + calcNet(emp.tips[day]), 0)
    rows.push([emp.name, 'WEEKLY TOTAL', '', '', '', '', weekTotal.toFixed(2)])
    rows.push([])
  })

  return rows.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n')
}

export default function BookkeeperExport() {
  const navigate = useNavigate()
  const [weekOffset, setWeekOffset] = useState(-1)
  const [downloaded, setDownloaded] = useState(false)

  const weekDates = getWeekDates(weekOffset)
  const weekStart = weekDates[0].date
  const weekEnd = weekDates[6].date
  const weekYear = weekDates[6].full.getFullYear()
  const weekLabel = weekStart + ' - ' + weekEnd + ', ' + weekYear

  function handleDownload() {
    const csv = generateCSV(weekDates, weekLabel)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jm-gerrish-payroll-' + weekStart.replace(/ /g, '-') + '-to-' + weekEnd.replace(/ /g, '-') + '.csv'
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const allStaff = [...DEMO_DATA.foh, ...DEMO_DATA.boh]
  const totalWeekHours = allStaff.reduce((sum, e) => sum + totalHours(e), 0)
  const waitStaff = DEMO_DATA.foh.filter(e => e.tips)
  const totalCCTips = waitStaff.reduce((sum, e) => sum + DAYS.reduce((s, day) => s + (e.tips[day]?.cc || 0), 0), 0)
  const totalNetTips = waitStaff.reduce((sum, e) => sum + DAYS.reduce((s, day) => s + calcNet(e.tips[day]), 0), 0)

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Header */}
      <div style={{ background: DARK, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid ' + COPPER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, color: COPPER }}>CD</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: '#fff' }}>Bookkeeper Export</div>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>JM Gerrish · Weekly Payroll</div>
          </div>
        </div>
        <button onClick={() => navigate('/manager')} style={{ background: 'transparent', border: '1px solid rgba(217,195,163,0.2)', borderRadius: 6, padding: '7px 14px', fontSize: 11, color: 'rgba(217,195,163,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          Back to Daily View
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>

        {/* Week selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: DARK }}>Weekly Payroll Export</div>
            <div style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{weekLabel}</div>
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

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            ['Total Staff', allStaff.length, 'All employees'],
            ['Total Hours', totalWeekHours.toFixed(1) + 'h', 'FOH + BOH'],
            ['CC Tips', '$' + totalCCTips.toFixed(2), 'All wait staff'],
            ['Net Taxable Tips', '$' + totalNetTips.toFixed(2), 'After deductions'],
          ].map(([label, val, sub]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: COPPER }}>{val}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: DARK, marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: '#8A9E8A', marginTop: 1 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* FOH Preview */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(160,101,53,0.08)', padding: '10px 16px', borderBottom: '1px solid #EDE6DA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COPPER }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Front of House — Hours Preview</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF8' }}>
                <th style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #EDE6DA' }}>Employee</th>
                <th style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #EDE6DA' }}>Role</th>
                {weekDates.map(({ day, date }) => (
                  <th key={day} style={{ padding: '8px 6px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid #EDE6DA' }}>
                    <div>{day}</div><div style={{ fontSize: 8, color: '#CCC' }}>{date}</div>
                  </th>
                ))}
                <th style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: COPPER, textTransform: 'uppercase', textAlign: 'right', borderBottom: '1px solid #EDE6DA' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_DATA.foh.map((emp, i) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #F5F0E8', background: i % 2 === 0 ? '#fff' : '#FDFCFB' }}>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: DARK }}>{emp.name}</td>
                  <td style={{ padding: '8px 12px', fontSize: 11, color: SAGE }}>{emp.role}</td>
                  {DAYS.map(day => (
                    <td key={day} style={{ padding: '8px 6px', fontSize: 11, textAlign: 'center', color: emp.hours[day] ? DARK : '#DDD' }}>
                      {emp.hours[day] ? emp.hours[day] + 'h' : '-'}
                    </td>
                  ))}
                  <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 700, color: COPPER, textAlign: 'right' }}>{totalHours(emp)}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOH Preview */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(107,125,107,0.08)', padding: '10px 16px', borderBottom: '1px solid #EDE6DA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: SAGE }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Back of House — Hours Preview</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF8' }}>
                <th style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #EDE6DA' }}>Employee</th>
                <th style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #EDE6DA' }}>Role</th>
                {weekDates.map(({ day, date }) => (
                  <th key={day} style={{ padding: '8px 6px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid #EDE6DA' }}>
                    <div>{day}</div><div style={{ fontSize: 8, color: '#CCC' }}>{date}</div>
                  </th>
                ))}
                <th style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: SAGE, textTransform: 'uppercase', textAlign: 'right', borderBottom: '1px solid #EDE6DA' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_DATA.boh.map((emp, i) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #F5F0E8', background: i % 2 === 0 ? '#fff' : '#FDFCFB' }}>
                  <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: DARK }}>{emp.name}</td>
                  <td style={{ padding: '8px 12px', fontSize: 11, color: SAGE }}>{emp.role}</td>
                  {DAYS.map(day => (
                    <td key={day} style={{ padding: '8px 6px', fontSize: 11, textAlign: 'center', color: emp.hours[day] ? DARK : '#DDD' }}>
                      {emp.hours[day] ? emp.hours[day] + 'h' : '-'}
                    </td>
                  ))}
                  <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 700, color: SAGE, textAlign: 'right' }}>{totalHours(emp)}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip summary preview */}
        <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(160,101,53,0.08)', padding: '10px 16px', borderBottom: '1px solid #EDE6DA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COPPER }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tip Summary — Wait Staff</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF8' }}>
                {['Employee', 'Cash Tips', 'Cash Out', 'CC Tips', 'Tip Out', 'Net Taxable', 'Total Hours'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#8A9E8A', textTransform: 'uppercase', textAlign: h === 'Employee' ? 'left' : 'right', borderBottom: '1px solid #EDE6DA' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {waitStaff.map((emp, i) => {
                const weekCash = DAYS.reduce((sum, day) => sum + (emp.tips[day]?.cash || 0), 0)
                const weekCashOut = DAYS.reduce((sum, day) => sum + (emp.tips[day]?.cashOut || 0), 0)
                const weekCC = DAYS.reduce((sum, day) => sum + (emp.tips[day]?.cc || 0), 0)
                const weekTipOut = DAYS.reduce((sum, day) => sum + (emp.tips[day]?.tipOut || 0), 0)
                const weekNet = DAYS.reduce((sum, day) => sum + calcNet(emp.tips[day]), 0)
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #F5F0E8', background: i % 2 === 0 ? '#fff' : '#FDFCFB' }}>
                    <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: DARK }}>{emp.name}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, textAlign: 'right', color: DARK }}>${weekCash.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, textAlign: 'right', color: '#E07070' }}>-${weekCashOut.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, textAlign: 'right', color: DARK }}>${weekCC.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, textAlign: 'right', color: '#E07070' }}>-${weekTipOut.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 700, textAlign: 'right', color: COPPER }}>${weekNet.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, textAlign: 'right', color: DARK }}>{totalHours(emp)}h</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Download button */}
        <div style={{ background: DARK, borderRadius: 12, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Ready to export?</div>
            <div style={{ fontSize: 11, color: 'rgba(217,195,163,0.5)', lineHeight: 1.6 }}>
              Downloads a CSV with all hours and tip data for {weekLabel}.<br/>
              Send directly to your bookkeeper or import into payroll.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <button onClick={handleDownload} style={{ background: downloaded ? '#4A7C59' : COPPER, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
              {downloaded ? <Check size={18} /> : <Download size={18} />}
              {downloaded ? 'Downloaded!' : 'Download CSV'}
            </button>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.3)' }}>jm-gerrish-payroll-{weekStart.replace(/ /g,'-')}.csv</div>
          </div>
        </div>
      </div>
    </div>
  )
}