import { useNavigate } from 'react-router-dom'

const COPPER = '#A06535'
const DARK = '#2B2B2B'
const SAGE = '#6B7D6B'
const CREAM = '#F7F2EB'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .primary-btn { background: #A06535; color: #fff; border: none; border-radius: 8px; padding: 13px 32px; font-family: Montserrat, sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .primary-btn:hover { background: #B8734A; transform: translateY(-1px); }
        .outline-btn { background: transparent; color: #A06535; border: 1.5px solid #A06535; border-radius: 8px; padding: 12px 28px; font-family: Montserrat, sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .outline-btn:hover { background: rgba(160,101,53,0.08); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <nav style={{ background: '#fff', borderBottom: '1px solid #EDE6DA', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #A06535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 13, fontWeight: 700, color: '#A06535' }}>CD</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: DARK, lineHeight: 1 }}>Collective Dining</div>
            <div style={{ fontSize: 9, color: '#8A9E8A', textTransform: 'uppercase', letterSpacing: '0.12em' }}>by Gallagher Collective Works</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="outline-btn" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => navigate('/login')}>Sign In</button>
          <button className="primary-btn" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => navigate('/demo')}>Try Demo</button>
        </div>
      </nav>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-block', background: 'rgba(160,101,53,0.1)', border: '1px solid rgba(160,101,53,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 600, color: COPPER, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Restaurant Management - Built for Real Teams
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.2rem', fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Your restaurant deserves<br /><em style={{ color: COPPER }}>better tools.</em>
          </h1>
          <p style={{ fontSize: 15, color: SAGE, lineHeight: 1.8, marginBottom: '2rem', maxWidth: 440 }}>
            Collective Dining gives restaurants a complete workforce platform - timekeeping, tip tracking, FOH and BOH management, and bookkeeper exports. Beautifully simple.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button className="primary-btn" onClick={() => navigate('/demo')}>Try the Live Demo</button>
            <button className="outline-btn" onClick={() => window.location.href = 'mailto:info@gallaghercollectiveworks.com'}>Contact Us</button>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {[['FOH + BOH', 'Split management'], ['Auto', 'Tip calculations'], ['Mobile', 'For your staff']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: COPPER, fontWeight: 700, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#8A9E8A', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="float" style={{ background: '#fff', border: '1px solid #EDE6DA', borderRadius: 16, padding: '1.5rem', boxShadow: '0 16px 48px rgba(43,43,43,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #EDE6DA' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 600, color: DARK }}>JM Gerrish</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4A7C59', background: 'rgba(74,124,89,0.1)', padding: '3px 10px', borderRadius: 20 }}>Today - Live</div>
            </div>
            {[
              ['FOH Staff', '4', 'Clocked in', COPPER],
              ['BOH Staff', '4', 'In kitchen', SAGE],
              ['Total Hours', '38.5', 'Today', DARK],
              ['CC Tips', '$142.00', 'Entered by LJ', COPPER],
            ].map(([label, val, sub, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: CREAM, borderRadius: 8, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, color: SAGE }}>{label}</div>
                  <div style={{ fontSize: 10, color: '#8A9E8A' }}>{sub}</div>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #EDE6DA', fontSize: 11, color: SAGE, fontStyle: 'italic' }}>
              Built to Work. Made for You. - Gallagher Collective Works
            </div>
          </div>
          <div style={{ position: 'absolute', top: -14, right: -14, background: DARK, color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 11, fontWeight: 600 }}>
            Branded to your restaurant
          </div>
        </div>
      </section>

      <div style={{ background: '#3D3530', padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {['FOH & BOH Split', 'Tip tracking built in', 'Mobile for staff', 'Bookkeeper export', 'No long-term contracts'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(217,195,163,0.7)', fontWeight: 500 }}>
              <span style={{ color: COPPER }}>+</span> {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '5rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COPPER, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Coming Soon</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: DARK, marginBottom: '1rem' }}>Be the first to know when we launch.</h2>
        <p style={{ fontSize: 14, color: SAGE, lineHeight: 1.8, marginBottom: '1.5rem' }}>Collective Dining is currently in development with our launch partner. Interested in being an early client?</p>
        <button className="primary-btn" onClick={() => window.location.href = 'mailto:info@gallaghercollectiveworks.com?subject=Collective Dining Interest'}>Get Early Access</button>
      </div>

      <footer style={{ background: '#1E1E1E', padding: '2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#fff', fontWeight: 600, marginBottom: 4 }}>Collective Dining</div>
            <div style={{ fontSize: 10, color: 'rgba(217,195,163,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>A Gallagher Collective Works Product</div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(217,195,163,0.3)' }}>2025 Gallagher Collective Works LLC</div>
        </div>
      </footer>
    </div>
  )
}