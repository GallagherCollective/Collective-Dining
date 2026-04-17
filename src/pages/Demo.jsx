import { useNavigate } from 'react-router-dom'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

export default function Demo() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .role-card { background: #fff; border: 1px solid #EDE6DA; border-radius: 16px; padding: 2rem; cursor: pointer; transition: all 0.2s; text-align: center; }
        .role-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(43,43,43,0.1); }
      `}</style>

      <div style={{ background: DARK, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #A06535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, color: '#A06535' }}>CD</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: '#fff' }}>Collective Dining</div>
            <div style={{ fontSize: 9, color: 'rgba(217,195,163,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>by Gallagher Collective Works</div>
          </div>
        </div>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid rgba(217,195,163,0.2)', borderRadius: 6, padding: '6px 14px', fontSize: 11, color: 'rgba(217,195,163,0.6)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Back</button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Live Demo</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', fontWeight: 700, color: DARK, marginBottom: '1rem', lineHeight: 1.2 }}>See it for yourself.</h1>
          <p style={{ fontSize: 14, color: SAGE, lineHeight: 1.8 }}>Two roles. One click. No password needed. Experience exactly what each person sees in Collective Dining.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: '2.5rem' }}>
          <div className="role-card" onClick={() => navigate('/manager')} style={{ borderTop: '3px solid #A06535' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(160,101,53,0.1)', border: '2px solid #A06535', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A06535" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: DARK, marginBottom: 6 }}>Manager View</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>LJ Power · Supervisor</div>
            <p style={{ fontSize: 12, color: SAGE, lineHeight: 1.6, marginBottom: '1.25rem' }}>Daily timesheet for all staff. Enter CC tips. View FOH and BOH hours. Save the day and send to bookkeeper.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: '1.25rem' }}>
              {['FOH & BOH split', 'CC tip entry', 'Hours tracking', 'Save day'].map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(160,101,53,0.08)', color: COPPER, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <div style={{ background: '#A06535', color: '#fff', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600 }}>Enter Manager View</div>
          </div>

          <div className="role-card" onClick={() => navigate('/employee')} style={{ borderTop: '3px solid #6B7D6B' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(107,125,107,0.1)', border: '2px solid #6B7D6B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7D6B" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: DARK, marginBottom: 6 }}>Employee View</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Megan R. · Wait Staff</div>
            <p style={{ fontSize: 12, color: SAGE, lineHeight: 1.6, marginBottom: '1.25rem' }}>Clock out and submit tips from your phone. Enter cash tips, cash out, and tip out. Net taxable tips calculated instantly.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: '1.25rem' }}>
              {['Clock in/out', 'Cash tips', 'Tip out', 'Net taxable'].map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(107,125,107,0.08)', color: SAGE, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <div style={{ background: '#6B7D6B', color: '#fff', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600 }}>Enter Employee View</div>
          </div>
        </div>

        <div style={{ background: DARK, borderRadius: 14, padding: '1.5rem 2rem' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', textAlign: 'center' }}>What you can explore in the demo</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              ['Clock In/Out', 'Time tracking for all staff'],
              ['Tip Tracking', 'Cash, CC tips and cash out'],
              ['FOH / BOH Split', 'Front and back of house'],
              ['Net Taxable', 'Auto-calculated tips'],
              ['Role Selection', 'Wait staff vs counter daily'],
              ['Tip Out', 'Busser and host tip tracking'],
              ['Save Day', 'Send hours to bookkeeper'],
              ['Mobile First', 'Built for phones'],
            ].map(([title, desc]) => (
              <div key={title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.4)', lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: 12, color: SAGE }}>
          Want a personalized walkthrough?{' '}
          <a href="mailto:info@gallaghercollectiveworks.com" style={{ color: COPPER, fontWeight: 600, textDecoration: 'none' }}>info@gallaghercollectiveworks.com</a>
        </div>
      </div>
    </div>
  )
}