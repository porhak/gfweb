const { useState, useEffect, useRef } = React;

const START_DATE = new Date(2025, 1, 2, 0, 0, 0);
const TARGET_DATE = new Date(2026, 10, 16, 0, 0, 0);

function pad(n) {
  return String(n).padStart(2, '0');
}

function useTimeCounter(startDate) {
  const [time, setTime] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) { seconds += 60; minutes--; }
      if (minutes < 0) { minutes += 60; hours--; }
      if (hours < 0) { hours += 24; days--; }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) { months += 12; years--; }

      setTime({ years, months, days, hours, minutes, seconds });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  return time;
}

function useCountdown(targetDate) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const now = new Date();
      const diffMs = targetDate - now;

      if (diffMs <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      let totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTime({ days, hours, minutes, seconds });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

function spawnHearts() {
  const emojis = ['💛', '💕', '🐻', '✨'];
  for (let i = 0; i < 24; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (3 + Math.random() * 2) + 's';
    heart.style.fontSize = (1.2 + Math.random() * 1.4) + 'rem';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5500);
  }
}

function Bear() {
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    let timeoutId;

    function freeze() {
      el.src = 'images/bear-frame-final.png';
    }

    if (el.complete) {
      timeoutId = setTimeout(freeze, 2470);
    } else {
      const onLoad = () => { timeoutId = setTimeout(freeze, 2470); };
      el.addEventListener('load', onLoad, { once: true });
      return () => el.removeEventListener('load', onLoad);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  return <img ref={imgRef} className="bear" src="images/bear.gif" alt="bubu and dudu" />;
}

function HomePage({ homeKey, onReveal }) {
  return (
    <div className="stage">
      <div className="card" key={homeKey}>
        <Bear />
        <h1>Hello babe</h1>
        <p className="sub">Happy anniversary</p>
        <p className="sub">I made something special just for you...</p>
        <button className="btn" onClick={onReveal}>HERE</button>
      </div>
    </div>
  );
}

function SurpriseOverlay({ show, onClose, onOpenGallery, onOpenTime, onOpenCountdown }) {
  return (
    <div className={'overlay' + (show ? ' show' : '')} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="letter">
        <h2>SURPRISE BABE !!!</h2>
        <div className="photo-row">
          <div className="photo-frame p1" onClick={onOpenGallery}>
            <img src="images/photo.jpg" alt="photo" />
          </div>
          <div className="photo-frame p2" onClick={onOpenTime}>
            <img src="images/second.jpg" alt="photo" />
          </div>
          <div className="photo-frame p3" onClick={onOpenCountdown}>
            <img src="images/third.png" alt="photo" />
          </div>
        </div>
        <button className="close" onClick={onClose}>close</button>
      </div>
    </div>
  );
}

const STICKERS = [
  { r: 'r1', gs: 'gs1', src: 'images/sticker-rose.png' },
  { r: 'r2', gs: 'gs2', src: 'images/sticker-heart.png' },
  { r: 'r3', gs: 'gs3', src: 'images/sticker-phone.png' },
  { r: 'r4', gs: 'gs4', src: 'images/sticker-wave.png' },
  { r: 'r5', gs: 'gs5', src: 'images/sticker-cry.png' },
  { r: 'r6', gs: 'gs6', src: 'images/sticker-wink.png' },
  { r: 'r7', gs: 'gs7', src: 'images/sticker-camera.png' },
  { r: 'r8', gs: 'gs9', src: 'images/sticker-bowtie.png' },
];

function GalleryOverlay({ show, onClose }) {
  return (
    <div className={'overlay' + (show ? ' show' : '')} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gallery-card">
        <div className="polaroid-grid">
          {STICKERS.map((s) => (
            <div className={'polaroid ' + s.r} key={s.r}>
              <div className="placeholder-photo"></div>
              <img className={'gsticker ' + s.gs} src={s.src} alt="" />
            </div>
          ))}
        </div>
        <button className="btn back-btn" onClick={onClose}>BACK</button>
      </div>
    </div>
  );
}

function TimeOverlay({ show, onClose }) {
  const t = useTimeCounter(START_DATE);

  return (
    <div className={'overlay' + (show ? ' show' : '')} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="time-card">
        <div className="time-top">
          <div className="time-message">Here's the time we've spent together, and I hope we have forever more.</div>
          <button className="time-back" onClick={onClose} aria-label="back">&#8592;</button>
        </div>
        <div className="time-row row1">
          <div className="time-unit">
            <span className="time-label">YEARS</span>
            <div className="time-box">{t.years}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">MONTHS</span>
            <div className="time-box">{t.months}</div>
          </div>
        </div>
        <div className="time-row row2">
          <div className="time-unit">
            <span className="time-label">DAYS</span>
            <div className="time-box">{pad(t.days)}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">HOURS</span>
            <div className="time-box">{pad(t.hours)}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">MINUTES</span>
            <div className="time-box">{pad(t.minutes)}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">SECONDS</span>
            <div className="time-box">{pad(t.seconds)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownOverlay({ show, onClose }) {
  const t = useCountdown(TARGET_DATE);

  return (
    <div className={'overlay' + (show ? ' show' : '')} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="time-card">
        <div className="time-top">
          <div className="time-message">Every second brings me closer to you.</div>
          <button className="time-back" onClick={onClose} aria-label="back">&#8592;</button>
        </div>
        <div className="time-row row2">
          <div className="time-unit">
            <span className="time-label">DAYS</span>
            <div className="time-box">{pad(t.days)}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">HOURS</span>
            <div className="time-box">{pad(t.hours)}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">MINUTES</span>
            <div className="time-box">{pad(t.minutes)}</div>
          </div>
          <div className="time-colon">:</div>
          <div className="time-unit">
            <span className="time-label">SECONDS</span>
            <div className="time-box">{pad(t.seconds)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [homeKey, setHomeKey] = useState(0);

  function handleReveal() {
    setShowSurprise(true);
    spawnHearts();
  }

  function handleCloseSurprise() {
    setShowSurprise(false);
    setHomeKey((k) => k + 1);
  }

  return (
    <>
      <HomePage homeKey={homeKey} onReveal={handleReveal} />
      <SurpriseOverlay
        show={showSurprise}
        onClose={handleCloseSurprise}
        onOpenGallery={() => setShowGallery(true)}
        onOpenTime={() => setShowTime(true)}
        onOpenCountdown={() => setShowCountdown(true)}
      />
      <GalleryOverlay show={showGallery} onClose={() => setShowGallery(false)} />
      <TimeOverlay show={showTime} onClose={() => setShowTime(false)} />
      <CountdownOverlay show={showCountdown} onClose={() => setShowCountdown(false)} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
