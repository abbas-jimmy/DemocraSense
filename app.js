/* ============================================================
   DemocraSense — app.js
   Injects CSS + handles: eligibility checker, AI chat, nav
   ============================================================ */

/* ── Inject CSS ── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:   #0d1b2a;
    --ink:    #1a2e44;
    --gold:   #d4a853;
    --gold-l: #f0c97a;
    --cream:  #f8f4ee;
    --rust:   #c0392b;
    --sage:   #2e7d52;
    --white:  #ffffff;
    --mid:    #4a6580;
    --light:  #e8ddd0;
    --radius: 12px;
    --shadow: 0 8px 32px rgba(13,27,42,0.12);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--navy);
    overflow-x: hidden;
  }

  /* ── NAV ── */
  #navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    display: flex; align-items: center; gap: 1.5rem;
    padding: 1rem 2.5rem;
    background: rgba(13,27,42,0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(212,168,83,0.2);
    transition: all 0.3s;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 900;
    color: var(--gold); white-space: nowrap;
  }
  .nav-links {
    display: flex; gap: 1.2rem; list-style: none; flex: 1;
  }
  .nav-links a {
    color: rgba(255,255,255,0.75); text-decoration: none;
    font-size: 0.82rem; font-weight: 500; letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta {
    background: var(--gold); color: var(--navy);
    border: none; padding: 0.55rem 1.2rem;
    border-radius: 6px; font-weight: 700;
    font-size: 0.82rem; cursor: pointer; white-space: nowrap;
    transition: background 0.2s;
  }
  .nav-cta:hover { background: var(--gold-l); }

  /* ── HERO ── */
  #hero {
    min-height: 100vh;
    background: var(--navy);
    display: flex; align-items: center; justify-content: space-between;
    padding: 7rem 4rem 4rem;
    position: relative; overflow: hidden; gap: 3rem;
  }
  .hero-bg-pattern {
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(212,168,83,0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(46,125,82,0.06) 0%, transparent 40%),
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px),
      repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px);
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 1; max-width: 600px; }
  .hero-badge {
    display: inline-block;
    background: rgba(212,168,83,0.15);
    border: 1px solid rgba(212,168,83,0.4);
    color: var(--gold); font-size: 0.8rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.4rem 1rem; border-radius: 100px;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.8s both;
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 900; line-height: 1.05;
    color: var(--white);
    animation: fadeUp 0.8s 0.1s both;
  }
  h1 .accent { color: var(--gold); }
  .hero-sub {
    margin-top: 1.5rem; font-size: 1.1rem;
    color: rgba(255,255,255,0.65); line-height: 1.7; max-width: 480px;
    animation: fadeUp 0.8s 0.2s both;
  }
  .hero-actions {
    display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap;
    animation: fadeUp 0.8s 0.3s both;
  }
  .btn-primary {
    background: var(--gold); color: var(--navy);
    border: none; padding: 0.85rem 2rem;
    border-radius: 8px; font-weight: 700; font-size: 0.95rem;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-primary:hover { background: var(--gold-l); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212,168,83,0.3); }
  .btn-outline {
    background: transparent; color: var(--white);
    border: 1.5px solid rgba(255,255,255,0.4);
    padding: 0.85rem 2rem; border-radius: 8px;
    font-weight: 500; font-size: 0.95rem; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  /* ballot graphic */
  .hero-graphic {
    position: relative; z-index: 1; flex-shrink: 0;
    animation: floatCard 4s ease-in-out infinite;
  }
  .ballot-card {
    background: var(--white); border-radius: 12px;
    padding: 2rem 2.5rem; width: 260px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.4);
    transform: rotate(-4deg);
    border: 2px solid var(--light);
  }
  .ballot-header {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--mid);
    text-align: center; padding-bottom: 1rem;
  }
  .ballot-line { height: 1px; background: var(--light); margin-bottom: 1rem; }
  .ballot-option {
    padding: 0.6rem 0.8rem; margin-bottom: 0.5rem;
    border-radius: 6px; font-size: 0.9rem;
    color: var(--ink); border: 1px solid var(--light);
    transition: all 0.2s;
  }
  .ballot-option.selected {
    background: #e8f5ee; border-color: var(--sage);
    color: var(--sage); font-weight: 700;
  }
  .ballot-footer {
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    letter-spacing: 0.1em; color: var(--gold); text-align: center;
    padding-top: 1rem; font-weight: 700;
  }
  @keyframes floatCard {
    0%,100% { transform: rotate(-4deg) translateY(0); }
    50% { transform: rotate(-4deg) translateY(-12px); }
  }

  /* ── STATS BAR ── */
  .stats-bar {
    background: var(--gold);
    display: flex; justify-content: space-around; flex-wrap: wrap;
    padding: 1.5rem 2rem; gap: 1rem;
  }
  .stat { text-align: center; }
  .stat-num {
    display: block; font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900; color: var(--navy);
  }
  .stat-label {
    font-size: 0.75rem; font-weight: 600; color: var(--ink);
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  /* ── SECTIONS ── */
  .section {
    padding: 6rem 4rem;
    max-width: 1200px; margin: 0 auto;
  }
  .section-dark {
    background: var(--navy); max-width: 100%;
    padding: 6rem 4rem; color: var(--white);
  }
  .section-dark .section-title { color: var(--white); }
  .section-dark .section-sub { color: rgba(255,255,255,0.65); }
  .section-accent {
    background: var(--ink); max-width: 100%;
    padding: 6rem 4rem; color: var(--white);
  }
  .section-accent .section-title { color: var(--white); }
  .section-accent .section-sub { color: rgba(255,255,255,0.65); }
  .section-assistant {
    background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%);
    max-width: 100%; padding: 6rem 4rem; color: var(--white);
  }
  .section-assistant .section-title { color: var(--white); }
  .section-assistant .section-sub { color: rgba(255,255,255,0.65); }
  .section-tag {
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 0.75rem; opacity: 0.9;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 900;
    color: var(--navy); margin-bottom: 1rem; line-height: 1.1;
  }
  .section-sub {
    font-size: 1.05rem; color: var(--mid);
    max-width: 600px; line-height: 1.7; margin-bottom: 3rem;
  }

  /* ── TWO-COL ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; margin-top: 2rem; }
  .text-block p { line-height: 1.8; color: var(--mid); margin-bottom: 1rem; font-size: 1rem; }
  .text-block strong { color: var(--navy); }
  .card-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .icon-card {
    background: var(--white); border: 1px solid var(--light);
    border-radius: var(--radius); padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .icon-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
  .icon-card-icon { font-size: 1.8rem; margin-bottom: 0.6rem; }
  .icon-card h4 { font-size: 0.95rem; font-weight: 700; color: var(--navy); margin-bottom: 0.3rem; }
  .icon-card p { font-size: 0.82rem; color: var(--mid); line-height: 1.5; }

  /* ── ELIGIBILITY ── */
  .eligibility-tool {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;
    max-width: 1100px; margin: 0 auto;
  }
  .eligibility-form {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: var(--radius); padding: 2.5rem;
  }
  .eligibility-form h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; color: var(--white); margin-bottom: 0.5rem;
  }
  .form-note { font-size: 0.82rem; color: rgba(255,255,255,0.5); margin-bottom: 2rem; }
  .dob-inputs { display: grid; grid-template-columns: 2fr 1fr 1.5fr; gap: 1rem; margin-bottom: 1.5rem; }
  .dob-group label { display: block; font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .dob-group select, .dob-group input {
    width: 100%; padding: 0.75rem 1rem;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px; color: var(--white);
    font-size: 0.95rem; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .dob-group select:focus, .dob-group input:focus { border-color: var(--gold); }
  .dob-group select option { background: var(--navy); color: var(--white); }
  .full-width { width: 100%; }
  .eligibility-result {
    margin-top: 1.5rem; padding: 1.5rem;
    border-radius: 10px; font-size: 1rem; line-height: 1.6;
    animation: fadeUp 0.5s both;
  }
  .eligibility-result.eligible { background: rgba(46,125,82,0.2); border: 1px solid rgba(46,125,82,0.5); color: #7dd4a0; }
  .eligibility-result.not-eligible { background: rgba(192,57,43,0.2); border: 1px solid rgba(192,57,43,0.5); color: #f48; }
  .eligibility-result.error { background: rgba(212,168,83,0.15); border: 1px solid rgba(212,168,83,0.4); color: var(--gold-l); }
  .eligibility-result.hidden { display: none; }
  .eligibility-result .result-icon { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
  .eligibility-result h4 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem; }

  .eligibility-requirements {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius); padding: 2.5rem;
  }
  .eligibility-requirements h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; color: var(--white); margin-bottom: 1.5rem;
  }
  .req-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
  .req-item { display: flex; align-items: flex-start; gap: 0.8rem; font-size: 0.9rem; color: rgba(255,255,255,0.8); }
  .req-icon {
    flex-shrink: 0; width: 24px; height: 24px;
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 0.7rem; font-weight: 700; margin-top: 1px;
  }
  .req-req { background: rgba(46,125,82,0.3); color: #7dd4a0; }
  .req-no { background: rgba(192,57,43,0.3); color: #f87; }
  .note-box {
    margin-top: 1.5rem; padding: 1rem 1.2rem;
    background: rgba(212,168,83,0.1); border-left: 3px solid var(--gold);
    border-radius: 0 8px 8px 0; font-size: 0.85rem; color: rgba(255,255,255,0.7);
    line-height: 1.6;
  }

  /* ── TIMELINE ── */
  .timeline { position: relative; padding: 1rem 0; max-width: 800px; margin: 0 auto; }
  .timeline::before {
    content: ''; position: absolute; left: 28px; top: 0; bottom: 0;
    width: 2px; background: linear-gradient(to bottom, var(--gold), rgba(212,168,83,0.1));
  }
  .timeline-item {
    display: flex; gap: 2rem; margin-bottom: 2.5rem;
    animation: fadeUp 0.6s both;
  }
  .timeline-item:nth-child(1) { animation-delay: 0.05s; }
  .timeline-item:nth-child(2) { animation-delay: 0.1s; }
  .timeline-item:nth-child(3) { animation-delay: 0.15s; }
  .timeline-item:nth-child(4) { animation-delay: 0.2s; }
  .timeline-item:nth-child(5) { animation-delay: 0.25s; }
  .timeline-item:nth-child(6) { animation-delay: 0.3s; }
  .timeline-item:nth-child(7) { animation-delay: 0.35s; }
  .timeline-item:nth-child(8) { animation-delay: 0.4s; }
  .timeline-dot {
    flex-shrink: 0; width: 58px; height: 58px;
    background: var(--gold); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-weight: 900;
    font-size: 1.1rem; color: var(--navy);
    box-shadow: 0 0 0 4px var(--cream);
    position: relative; z-index: 1;
  }
  .timeline-item[data-step="6"] .timeline-dot {
    background: var(--sage); color: var(--white);
    box-shadow: 0 0 0 4px var(--cream), 0 0 20px rgba(46,125,82,0.5);
  }
  .timeline-content {
    background: var(--white); border: 1px solid var(--light);
    border-radius: var(--radius); padding: 1.5rem 2rem; flex: 1;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .timeline-content:hover { transform: translateX(4px); box-shadow: 0 12px 40px rgba(13,27,42,0.15); }
  .timeline-content h4 { font-weight: 700; font-size: 1.05rem; margin-bottom: 0.4rem; color: var(--navy); }
  .timeline-content p { font-size: 0.9rem; color: var(--mid); line-height: 1.6; }
  .timeline-tag {
    display: inline-block; margin-top: 0.8rem;
    background: rgba(212,168,83,0.1); color: var(--gold);
    border: 1px solid rgba(212,168,83,0.3);
    border-radius: 100px; padding: 0.25rem 0.8rem;
    font-size: 0.75rem; font-weight: 600; font-family: 'DM Mono', monospace;
  }

  /* ── HOW TO VOTE STEPS ── */
  .steps-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
    max-width: 1100px; margin: 0 auto 4rem;
  }
  .step-card {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius); padding: 2rem;
    transition: transform 0.2s, border-color 0.2s;
  }
  .step-card:hover { transform: translateY(-4px); border-color: var(--gold); }
  .step-num {
    font-family: 'DM Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 0.5rem;
  }
  .step-icon { font-size: 2rem; margin-bottom: 0.8rem; }
  .step-card h4 { font-weight: 700; color: var(--white); margin-bottom: 0.5rem; }
  .step-card p { font-size: 0.88rem; color: rgba(255,255,255,0.65); line-height: 1.6; }
  .vote-types { max-width: 1100px; margin: 0 auto; }
  .vote-types h3 {
    font-family: 'Playfair Display', serif; font-size: 1.6rem;
    color: var(--gold); margin-bottom: 1.5rem;
  }
  .vote-type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .vote-type-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius); padding: 1.5rem;
  }
  .vote-type-card h4 { font-size: 0.9rem; color: var(--white); margin-bottom: 0.5rem; }
  .vote-type-card p { font-size: 0.82rem; color: rgba(255,255,255,0.55); line-height: 1.5; }

  /* ── CHOOSE FRAMEWORK ── */
  .choose-framework {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1rem;
  }
  .framework-card {
    background: var(--white); border: 1px solid var(--light);
    border-radius: var(--radius); padding: 2rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .framework-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
  .fw-icon { font-size: 2rem; margin-bottom: 0.8rem; }
  .framework-card h4 { font-weight: 700; color: var(--navy); margin-bottom: 0.6rem; font-size: 1rem; }
  .framework-card p { font-size: 0.88rem; color: var(--mid); line-height: 1.6; margin-bottom: 0.8rem; }
  .framework-card ul { padding-left: 1.2rem; }
  .framework-card ul li { font-size: 0.82rem; color: var(--mid); margin-bottom: 0.3rem; line-height: 1.5; }

  /* ── RULES ── */
  .rules-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
    max-width: 1100px; margin: 0 auto;
  }
  .rule-block {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius); padding: 2rem;
  }
  .rule-block h4 { color: var(--gold); font-weight: 700; margin-bottom: 1rem; font-size: 0.95rem; }
  .rule-block ul { padding-left: 1.2rem; list-style: disc; }
  .rule-block ul li { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem; line-height: 1.5; }

  /* ── CHAT ── */
  .chat-container {
    max-width: 760px; margin: 0 auto;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px; overflow: hidden;
  }
  .chat-messages {
    height: 420px; overflow-y: auto; padding: 1.5rem;
    display: flex; flex-direction: column; gap: 1rem;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
  .chat-msg { display: flex; gap: 0.8rem; align-items: flex-start; }
  .ai-msg { flex-direction: row; }
  .user-msg { flex-direction: row-reverse; }
  .msg-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(212,168,83,0.2); border: 1px solid rgba(212,168,83,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .user-msg .msg-avatar { background: rgba(46,125,82,0.2); border-color: rgba(46,125,82,0.4); }
  .msg-bubble {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 1rem 1.2rem;
    font-size: 0.9rem; color: rgba(255,255,255,0.88);
    line-height: 1.6; max-width: 85%;
  }
  .user-msg .msg-bubble {
    background: rgba(46,125,82,0.2); border-color: rgba(46,125,82,0.3);
  }
  .quick-questions {
    display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;
  }
  .quick-questions button {
    background: rgba(212,168,83,0.1); border: 1px solid rgba(212,168,83,0.3);
    color: var(--gold-l); padding: 0.35rem 0.8rem;
    border-radius: 100px; font-size: 0.78rem; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .quick-questions button:hover { background: rgba(212,168,83,0.25); }
  .chat-input-area {
    display: flex; gap: 0; border-top: 1px solid rgba(255,255,255,0.1);
  }
  #chat-input {
    flex: 1; padding: 1.1rem 1.5rem;
    background: transparent; border: none; outline: none;
    color: var(--white); font-size: 0.95rem;
    font-family: 'DM Sans', sans-serif;
  }
  #chat-input::placeholder { color: rgba(255,255,255,0.35); }
  #send-btn {
    background: var(--gold); border: none;
    padding: 1rem 1.8rem; cursor: pointer;
    font-size: 1.1rem; color: var(--navy);
    font-weight: 700; transition: background 0.2s;
  }
  #send-btn:hover { background: var(--gold-l); }
  #send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .typing-indicator .msg-bubble { display: flex; gap: 4px; align-items: center; padding: 1rem 1.4rem; }
  .typing-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,255,255,0.4);
    animation: typingBounce 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* ── FOOTER ── */
  footer {
    background: var(--navy); border-top: 1px solid rgba(255,255,255,0.08);
    padding: 4rem 4rem 2rem;
  }
  .footer-content {
    display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 3rem;
    max-width: 1100px; margin: 0 auto 3rem;
  }
  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 900; color: var(--gold); margin-bottom: 0.8rem;
  }
  .footer-brand p { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6; }
  .footer-links h5 { color: var(--gold); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; }
  .footer-links a { display: block; color: rgba(255,255,255,0.55); font-size: 0.85rem; text-decoration: none; margin-bottom: 0.5rem; transition: color 0.2s; }
  .footer-links a:hover { color: var(--gold); }
  .footer-disclaimer h5 { color: var(--gold); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem; }
  .footer-disclaimer p { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.6; }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 1.5rem; text-align: center;
    color: rgba(255,255,255,0.3); font-size: 0.82rem;
    display: flex; justify-content: space-between;
    max-width: 1100px; margin: 0 auto;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .two-col, .eligibility-tool, .choose-framework,
    .rules-grid, .steps-grid { grid-template-columns: 1fr 1fr; }
    .vote-type-grid { grid-template-columns: 1fr 1fr; }
    .footer-content { grid-template-columns: 1fr 1fr; }
    .nav-links { display: none; }
  }
  @media (max-width: 768px) {
    #hero { flex-direction: column; padding: 6rem 2rem 3rem; text-align: center; }
    .hero-graphic { display: none; }
    .two-col, .eligibility-tool, .choose-framework,
    .rules-grid, .steps-grid, .vote-type-grid { grid-template-columns: 1fr; }
    .dob-inputs { grid-template-columns: 1fr 1fr; }
    .footer-content { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
    .section, .section-dark, .section-accent, .section-assistant { padding: 4rem 1.5rem; }
    #navbar { padding: 1rem 1.5rem; }
    .hero-actions { justify-content: center; }
    .card-grid-2 { grid-template-columns: 1fr; }
  }
`;

const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

/* ── Also create app.css so the <link> doesn't 404 ── */
/* (handled above via injected <style>, link tag is harmless) */

/* ============================================================
   ELIGIBILITY CHECKER
   ============================================================ */
function checkEligibility() {
  const month = parseInt(document.getElementById('dob-month').value);
  const day   = parseInt(document.getElementById('dob-day').value);
  const year  = parseInt(document.getElementById('dob-year').value);
  const result = document.getElementById('eligibility-result');

  result.className = 'eligibility-result';
  result.classList.remove('hidden');

  // Validation
  if (!month || !day || !year || isNaN(day) || isNaN(year)) {
    result.classList.add('error');
    result.innerHTML = `<span class="result-icon">⚠️</span><h4>Please fill in all fields</h4><p>Enter your complete date of birth (month, day, and year).</p>`;
    return;
  }
  if (year < 1900 || year > new Date().getFullYear()) {
    result.classList.add('error');
    result.innerHTML = `<span class="result-icon">⚠️</span><h4>Invalid year</h4><p>Please enter a valid birth year.</p>`;
    return;
  }
  if (day < 1 || day > 31) {
    result.classList.add('error');
    result.innerHTML = `<span class="result-icon">⚠️</span><h4>Invalid day</h4><p>Please enter a valid day (1–31).</p>`;
    return;
  }

  const dob = new Date(year, month - 1, day);
  if (isNaN(dob.getTime()) || dob.getMonth() !== month - 1) {
    result.classList.add('error');
    result.innerHTML = `<span class="result-icon">⚠️</span><h4>Invalid date</h4><p>That date doesn't exist. Please check your entry.</p>`;
    return;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const dobFormatted = `${monthNames[month - 1]} ${day}, ${year}`;

  if (age >= 18) {
    const yearsVoting = age - 18;
    result.classList.add('eligible');
    result.innerHTML = `
      <span class="result-icon">✅</span>
      <h4>You Are Eligible to Vote!</h4>
      <p><strong>Date of Birth:</strong> ${dobFormatted}</p>
      <p><strong>Your Age:</strong> ${age} years old</p>
      <p>${yearsVoting > 0 ? `You've been eligible to vote for <strong>${yearsVoting} year${yearsVoting !== 1 ? 's' : ''}</strong>.` : `You <strong>just became eligible</strong> to vote this year! Welcome!`}</p>
      <br>
      <p>🗳 <strong>Next Step:</strong> Register to vote at <a href="https://vote.gov" target="_blank" style="color:var(--gold-l);text-decoration:underline;">vote.gov</a> if you haven't already. Check your state's registration deadline!</p>
    `;
  } else if (age >= 17) {
    const nextBirthday = new Date(today.getFullYear(), month - 1, day);
    if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    result.classList.add('not-eligible');
    result.innerHTML = `
      <span class="result-icon">🕐</span>
      <h4>Almost There — Not Quite 18 Yet</h4>
      <p><strong>Date of Birth:</strong> ${dobFormatted}</p>
      <p><strong>Your Age:</strong> ${age} years old</p>
      <p>You'll be eligible to vote in <strong>${daysUntil} day${daysUntil !== 1 ? 's' : ''}</strong> on your 18th birthday!</p>
      <br>
      <p>💡 <strong>Tip:</strong> Some states let 17-year-olds vote in primaries if they'll be 18 by the general election. Check your state's rules at <a href="https://vote.gov" target="_blank" style="color:var(--gold-l);text-decoration:underline;">vote.gov</a>.</p>
      <p>📋 You can <strong>pre-register</strong> in many states so you're ready the moment you turn 18!</p>
    `;
  } else {
    const yearsUntil = 18 - age;
    result.classList.add('not-eligible');
    result.innerHTML = `
      <span class="result-icon">📚</span>
      <h4>Not Eligible Yet — But Your Time is Coming!</h4>
      <p><strong>Date of Birth:</strong> ${dobFormatted}</p>
      <p><strong>Your Age:</strong> ${age} years old</p>
      <p>You'll be eligible to vote in <strong>${yearsUntil} year${yearsUntil !== 1 ? 's' : ''}</strong> when you turn 18.</p>
      <br>
      <p>🎓 <strong>In the meantime:</strong> Keep learning about civics, follow elections, and talk to eligible voters in your community. The best voters are informed voters!</p>
      <p>📋 Many states allow <strong>pre-registration at age 16</strong> so you're ready to vote when you turn 18!</p>
    `;
  }
}

/* ============================================================
   AI CHAT ASSISTANT
   ============================================================ */
const chatHistory = [];

function scrollChat() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function addMessage(role, content, isHTML = false) {
  const msgs = document.getElementById('chat-messages');
  const isAI = role === 'assistant';

  const div = document.createElement('div');
  div.className = `chat-msg ${isAI ? 'ai-msg' : 'user-msg'}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = isAI ? '🗳' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  if (isHTML) {
    bubble.innerHTML = content;
  } else {
    bubble.textContent = content;
  }

  div.appendChild(avatar);
  div.appendChild(bubble);
  msgs.appendChild(div);
  scrollChat();
  return div;
}

function addTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai-msg typing-indicator';
  div.id = 'typing';
  div.innerHTML = `
    <div class="msg-avatar">🗳</div>
    <div class="msg-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(div);
  scrollChat();
}

function removeTypingIndicator() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  sendBtn.disabled = true;

  addMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  addTypingIndicator();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are DemocraSense AI, a friendly, nonpartisan, and educational assistant focused entirely on helping people understand the democratic process, elections, voting, and civic participation in the United States.

Your personality: warm, encouraging, clear, and empowering. You make complex civic topics simple and accessible for all ages.

RULES:
- Be strictly nonpartisan — never endorse, favor, or criticize any political party, candidate, or ideology.
- Keep answers educational and factual, citing reputable civic sources when helpful (vote.gov, usa.gov, congress.gov, etc.)
- If asked about specific candidates or parties beyond factual descriptions, politely redirect to resources that let the user make their own informed decision (like ISideWith.com, PolitiFact, etc.)
- Keep responses concise but complete — use simple language.
- End responses with an encouraging note or a helpful tip when appropriate.
- If asked about something unrelated to voting/elections/democracy, politely redirect: "I'm specialized in helping with voting and democracy topics. Let me know if you have any election-related questions!"`,
        messages: chatHistory
      })
    });

    const data = await response.json();
    removeTypingIndicator();

    const reply = data.content?.[0]?.text || "I'm sorry, I had trouble answering that. Please try again!";
    chatHistory.push({ role: 'assistant', content: reply });

    // Format reply with basic markdown-like rendering
    const formatted = reply
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    addMessage('assistant', formatted, true);
  } catch (err) {
    removeTypingIndicator();
    addMessage('assistant', "I'm having trouble connecting right now. Please check your connection and try again.", false);
    chatHistory.pop(); // Remove failed user message from history
  }

  sendBtn.disabled = false;
  input.focus();
}

function askQuestion(q) {
  document.getElementById('chat-input').value = q;
  sendMessage();
}

/* ============================================================
   NAV SCROLL EFFECT
   ============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) {
    nav.style.padding = '0.65rem 2.5rem';
  } else {
    nav.style.padding = '1rem 2.5rem';
  }
});

/* ── Intersection Observer for subtle section animations ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.icon-card, .step-card, .framework-card, .rule-block, .vote-type-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
