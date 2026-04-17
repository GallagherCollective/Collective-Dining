import { useState } from 'react'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

export default function EmployeeDashboard() {
  const [step, setStep] = useState('clocked-in') // clocked-in, tips, submitted
  const [tips, setTips] = useState({ cashTips: '', cashOut: '', tipOutBusser: '', tipOutHost: '' })
  const clockInTime = '8:02 AM'
  const hoursWorked = '7 hrs 28 min'
  const ccTips = 18.00 // entered by LJ

  function calcNet() {
    const cash = parseFloat(tips.cashTips) || 0
    const cashOut = parseFloat(tips.cashOut) || 0
    const busser = parseFloat(tips.tipOutBusser) || 0
    const host = parseFloat(tips.tipOutHost) || 0
    return (cash - cashOut + ccTips - busser - host).toFixed(2)
  }

  const totalTipOut = (parseFloat(tips.tipOutBusser) || 0) + (parseFloat(tips.tipOutHost) || 0)

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: ${COPPER} !important; outline: none; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: DARK, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid ' + COPPER, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 11, fontWeight: 700, color: COPPER }}>CH</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 600, color: '#fff' }}>Collective Dining</div>
            <div style={{ fontSize: 9, color: 'rgba(217,195,163,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Power's Restaurant</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Megan R.</div>
          <div style={{ fontSize: 9, color: 'rgba(217,195,163,0.5)' }}>Wait Staff</div>
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>

        {step === 'clocked-in' && (
          <div>
            {/* Clock status */}
            <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,124,89,0.1)', border: '2px solid #4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4A7C59', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Currently Clocked In</div>
              <div style={{ fontSize: 13, color: SAGE, marginBottom: 4 }}>Clocked in at {clockInTime} · {hoursWorked} so far</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: DARK }}>7.5 hrs</div>
            </div>

            {/* CC Tips from LJ */}
            <div style={{ background: 'rgba(160,101,53,0.06)', border: '1px solid rgba(160,101,53,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>CC Tips Entered by LJ</div>
                <div style={{ fontSize: 11, color: SAGE }}>Credit card tips for today</div>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: COPPER }}>${ccTips.toFixed(2)}</div>
            </div>

            <button onClick={() => setStep('tips')} style={{ width: '100%', background: COPPER, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
              Clock Out & Enter Tips →
            </button>
          </div>
        )}

        {step === 'tips' && (
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: DARK, marginBottom: 4 }}>End of Shift</div>
            <div style={{ fontSize: 11, color: SAGE, marginBottom: '1.25rem' }}>Clock Out & Tips · Wait Staff today · 7.5 hrs worked</div>

            {/* Tips form */}
            <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: DARK, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Your Tips Today</div>

              {[
                { label: 'Cash Tips You Are Claiming', field: 'cashTips', note: 'You are responsible for claiming your cash tips — taxable', placeholder: '0.00' },
                { label: 'Cash Out', field: 'cashOut', note: 'Subtracted from your taxable tip income', placeholder: '0.00' },
              ].map(({ label, field, note, placeholder }) => (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: DARK }}>{label}</div>
                  </div>
                  <div style={{ fontSize: 10, color: SAGE, marginBottom: 6 }}>{note}</div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: SAGE }}>$</span>
                    <input type="number" placeholder={placeholder} value={tips[field]}
                      onChange={e => setTips(t => ({ ...t, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 10px 10px 22px', border: '1px solid #EDE6DA', borderRadius: 8, fontSize: 14, fontFamily: 'Montserrat, sans-serif', color: DARK }} />
                  </div>
                </div>
              ))}

              {/* CC Tips read-only */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(160,101,53,0.05)', borderRadius: 8, border: '1px solid rgba(160,101,53,0.15)' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: DARK }}>CC Tips (entered by LJ)</div>
                  <div style={{ fontSize: 10, color: SAGE }}>LJ enters CC tips for each person at end of week</div>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: COPPER }}>${ccTips.toFixed(2)}</div>
              </div>
            </div>

            {/* Tip Out */}
            <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: DARK, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Tip Out — Who are you tipping today?</div>
              {[
                { label: 'Busser', role: 'Support staff', field: 'tipOutBusser' },
                { label: 'Host / Hostess', role: 'Support staff', field: 'tipOutHost' },
              ].map(({ label, role, field }) => (
                <div key={field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{label}</div>
                    <div style={{ fontSize: 10, color: SAGE }}>{role}</div>
                  </div>
                  <div style={{ position: 'relative', width: 100 }}>
                    <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: SAGE }}>$</span>
                    <input type="number" placeholder="0.00" value={tips[field]}
                      onChange={e => setTips(t => ({ ...t, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '8px 8px 8px 18px', border: '1px solid #EDE6DA', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat, sans-serif', color: DARK, textAlign: 'right' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: DARK, borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(217,195,163,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Today's Summary</div>
              {[
                ['Cash Tips Claimed', '$' + (parseFloat(tips.cashTips) || 0).toFixed(2), false],
                ['Cash Out', '- $' + (parseFloat(tips.cashOut) || 0).toFixed(2), false],
                ['CC Tips (from LJ)', '$' + ccTips.toFixed(2), false],
                ['Tip Out Total', '- $' + totalTipOut.toFixed(2), false],
              ].map(([label, val, highlight]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(217,195,163,0.6)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: highlight ? COPPER : 'rgba(217,195,163,0.8)' }}>{val}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(217,195,163,0.15)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Net Taxable Tips</span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: COPPER }}>${calcNet()}</span>
              </div>
            </div>

            {tips.tipOutBusser || tips.tipOutHost ? (
              <div style={{ background: 'rgba(107,125,107,0.08)', border: '1px solid rgba(107,125,107,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: 11, color: SAGE }}>
                LJ can see and confirm these amounts. Recipients' income is automatically recorded.
              </div>
            ) : null}

            <button onClick={() => setStep('submitted')} style={{ width: '100%', background: COPPER, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
              Clock Out & Submit →
            </button>
          </div>
        )}

        {step === 'submitted' && (
          <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,124,89,0.1)', border: '2px solid #4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14l5 5 11-11" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: DARK, marginBottom: 8 }}>All done, Megan!</div>
            <div style={{ fontSize: 13, color: SAGE, lineHeight: 1.7, marginBottom: '1.5rem' }}>You're clocked out. Your tips have been recorded and your net taxable amount has been submitted.</div>
            <div style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 12, padding: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Today's Final Summary</div>
              {[
                ['Hours Worked', '7.5 hrs'],
                ['Cash Tips', '$' + (parseFloat(tips.cashTips) || 0).toFixed(2)],
                ['Cash Out', '- $' + (parseFloat(tips.cashOut) || 0).toFixed(2)],
                ['CC Tips', '$' + ccTips.toFixed(2)],
                ['Tip Out', '- $' + totalTipOut.toFixed(2)],
                ['Net Taxable Tips', '$' + calcNet()],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: SAGE }}>{label}</span>
                  <span style={{ fontWeight: 600, color: DARK }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom note */}
      <div style={{ padding: '1rem 1.25rem', textAlign: 'center', fontSize: 10, color: 'rgba(43,43,43,0.3)', borderTop: '1px solid #EDE6DA', marginTop: '2rem' }}>
        Collective Dining · A Gallagher Collective Works Product
      </div>
    </div>
  )
}