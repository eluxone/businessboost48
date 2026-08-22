(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const headerActions = document.querySelector('.header-actions');
  const headerCta = document.querySelector('.header-cta');
  const nicheLabel = document.querySelector('.header-context')?.textContent?.trim() || 'business website';
  const nicheName = nicheLabel.replace(/ websites?$/i, '').trim();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const whatsappNumber = '447438893486';
  const whatsappOpening = `Hi BusinessBoost48, I would like a free review of my ${nicheName.toLowerCase()} website.`;

  body.classList.add('industry-page');

  const soundButton = document.createElement('button');
  soundButton.className = 'industry-sound';
  soundButton.type = 'button';
  soundButton.setAttribute('aria-label', 'Sound starts with your next interaction');
  soundButton.setAttribute('aria-pressed', 'false');
  soundButton.innerHTML = '<span class="industry-sound-label">Sound ready</span><span class="industry-sound-bars" aria-hidden="true"><i></i><i></i><i></i></span>';
  headerActions?.insertBefore(soundButton, headerCta || null);

  const toast = document.createElement('div');
  toast.className = 'industry-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  body.append(toast);

  const dock = document.createElement('div');
  dock.className = 'conversion-dock';
  dock.dataset.whatsapp = whatsappNumber;
  dock.innerHTML = `
    <a class="niche-whatsapp" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappOpening)}" target="_blank" rel="noopener" aria-label="WA WhatsApp — open chat for a ${nicheName} website review">
      <span class="niche-wa-mark" aria-hidden="true">WA</span> <span>WhatsApp</span>
    </a>
    <button class="niche-ai-launch" type="button" aria-label="Open AI website adviser for ${escapeHtml(nicheName.toLowerCase())} websites" aria-haspopup="dialog" aria-expanded="false" aria-controls="niche-chat">
      <span class="niche-ai-mark" aria-hidden="true">AI</span>
      <span class="niche-ai-copy"><b>Ask Boost</b><span>${nicheName} adviser</span></span>
    </button>`;
  body.append(dock);

  const chat = document.createElement('section');
  chat.className = 'niche-chat';
  chat.id = 'niche-chat';
  chat.hidden = true;
  chat.setAttribute('role', 'dialog');
  chat.setAttribute('aria-modal', 'true');
  chat.setAttribute('aria-labelledby', 'niche-chat-title');
  chat.innerHTML = `
    <header class="niche-chat-header">
      <span class="niche-chat-avatar" aria-hidden="true">B/48</span>
      <div class="niche-chat-heading"><span>AI website adviser</span><h2 id="niche-chat-title">Ask about your ${escapeHtml(nicheName.toLowerCase())} website</h2></div>
      <button class="niche-chat-close" type="button" aria-label="Close AI adviser">×</button>
    </header>
    <div class="niche-chat-messages" aria-live="polite">
      <div class="niche-message assistant">Tell me what your current website is struggling with. I can help you think through the message, mobile journey and the next action your customers need.</div>
    </div>
    <footer class="niche-chat-footer">
      <div class="niche-starters" aria-label="Suggested questions">
        <button class="niche-starter" type="button">What should this website improve?</button>
        <button class="niche-starter" type="button">Which package fits?</button>
        <button class="niche-starter" type="button">How quickly can we start?</button>
      </div>
      <form class="niche-chat-form">
        <label class="skip-link" for="niche-chat-input">Ask the AI website adviser</label>
        <input id="niche-chat-input" name="message" autocomplete="off" maxlength="900" placeholder="Ask about your website…" required>
        <button type="submit" aria-label="Send message">↗</button>
      </form>
      <div class="niche-chat-meta"><span>AI guidance · A person reviews project scope</span><a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappOpening)}" target="_blank" rel="noopener">Continue on WhatsApp</a></div>
    </footer>`;
  body.append(chat);

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  const routes = [
    ['/restaurants/', 'Restaurant websites'],
    ['/trades/', 'Trades websites'],
    ['/retail/', 'Retail websites'],
    ['/garages/', 'Garage websites'],
    ['/accountants/', 'Accountant websites'],
    ['/pet-shops/', 'Pet shop websites'],
    ['/beauty-salons/', 'Beauty salon websites'],
    ['/estate-agents/', 'Estate agent websites']
  ];

  const related = document.createElement('section');
  related.className = 'related-niches';
  related.setAttribute('aria-labelledby', 'related-niches-title');
  related.innerHTML = `
    <div class="related-head">
      <h2 id="related-niches-title">Different niche. Different customer journey.</h2>
      <p>Explore how the same strategic foundation changes around the questions, trust signals and next action each business needs.</p>
    </div>
    <nav class="related-grid" aria-label="Industry website design pages">
      ${routes.map(([href, label]) => `<a href="${href}"${location.pathname === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>`;
  document.querySelector('.cta')?.before(related);

  const revealTargets = document.querySelectorAll('.section-intro, .need, .included-row, .journey-step, .fit-card, .faq-row, .related-head, .related-grid');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('visible'));
  } else {
    revealTargets.forEach(element => element.classList.add('niche-reveal'));
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  }

  let audioContext;
  let masterGain;
  let ambientGain;
  let effectsGain;
  let filter;
  let soundOn = false;
  let soundBuilt = false;
  let soundStateBound = false;
  let unlockPromise = null;
  let unlockersInstalled = false;
  let motifTimer = 0;
  let toastTimer = 0;
  const oscillators = [];
  let soundWanted = true;

  try {
    soundWanted = localStorage.getItem('bb48-sound-muted-v2') !== 'true';
    localStorage.removeItem('bb48-sound');
  } catch {}

  const pitchByNiche = {
    restaurant: 55,
    trades: 49,
    retail: 65.4,
    garage: 46.25,
    accountant: 61.7,
    pet: 58.3,
    beauty: 69.3,
    estate: 52
  };

  const nicheKey = Object.keys(pitchByNiche).find(key => nicheName.toLowerCase().includes(key)) || 'restaurant';
  const basePitch = pitchByNiche[nicheKey];

  function updateSoundUi(label) {
    soundButton.classList.toggle('on', soundOn);
    soundButton.classList.toggle('off', !soundWanted);
    const text = label || (soundOn ? 'Sound on' : soundWanted ? 'Sound ready' : 'Sound off');
    soundButton.querySelector('.industry-sound-label').textContent = text;
    soundButton.setAttribute('aria-pressed', String(soundOn));
    soundButton.setAttribute('aria-label', soundOn ? 'Turn cinematic sound off' : soundWanted ? 'Sound starts with your next interaction' : 'Turn cinematic sound on');
  }

  function buildSoundscape() {
    if (soundBuilt) return;
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) throw new Error('Web Audio is unavailable');
    audioContext = new AudioClass();
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 20;
    compressor.ratio.value = 8;
    compressor.attack.value = .006;
    compressor.release.value = .28;
    masterGain = audioContext.createGain();
    masterGain.gain.value = .0001;
    ambientGain = audioContext.createGain();
    ambientGain.gain.value = .018;
    effectsGain = audioContext.createGain();
    effectsGain.gain.value = .68;
    filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = .75;
    masterGain.connect(compressor).connect(audioContext.destination);
    ambientGain.connect(masterGain);
    effectsGain.connect(masterGain);
    filter.connect(ambientGain);

    [[basePitch, 'sine', .32], [basePitch * 1.5, 'triangle', .07], [basePitch * 4, 'sine', .012]].forEach(([frequency, type, level]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = level;
      oscillator.connect(gain).connect(filter);
      oscillator.start();
      oscillators.push(oscillator);
    });

    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) channel[index] = (Math.random() * 2 - 1) * .1;
    const noise = audioContext.createBufferSource();
    const noiseFilter = audioContext.createBiquadFilter();
    const noiseGain = audioContext.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 900;
    noiseFilter.Q.value = .5;
    noiseGain.gain.value = .006;
    noise.connect(noiseFilter).connect(noiseGain).connect(ambientGain);
    noise.start();
    soundBuilt = true;
  }

  function playTone(frequency, start = 0, duration = .2, volume = .024, type = 'sine') {
    if (!soundOn || !audioContext || !effectsGain) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const begins = audioContext.currentTime + start;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, begins);
    gain.gain.setValueAtTime(.0001, begins);
    gain.gain.exponentialRampToValueAtTime(volume, begins + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, begins + duration);
    oscillator.connect(gain).connect(effectsGain);
    oscillator.start(begins);
    oscillator.stop(begins + duration + .04);
  }

  function playOpening() {
    playTone(basePitch * 4, 0, .42, .026);
    playTone(basePitch * 6, .09, .5, .02, 'triangle');
    playTone(basePitch * 8, .21, .56, .014);
  }

  function stopMotif() {
    clearTimeout(motifTimer);
    motifTimer = 0;
  }

  function startMotif() {
    stopMotif();
    if (!soundOn || document.hidden) return;
    motifTimer = setTimeout(() => {
      if (soundOn && !document.hidden) {
        playTone(basePitch * 4, 0, .24, .01);
        playTone(basePitch * 6, .18, .3, .008, 'triangle');
        playTone(basePitch * 8, .4, .34, .006);
        startMotif();
      }
    }, 7800 + Math.random() * 3200);
  }

  function showToast() {
    clearTimeout(toastTimer);
    toast.innerHTML = '<b>Full sound is live</b><span>The ambient signal now follows this customer journey.</span>';
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.replaceChildren();
    }, 3200);
  }

  function handleSoundFailure() {
    soundOn = false;
    stopMotif();
    if (!(window.AudioContext || window.webkitAudioContext)) {
      soundWanted = false;
      updateSoundUi('Unavailable');
      soundButton.disabled = true;
      return;
    }
    updateSoundUi('Sound ready');
    installUnlockers();
  }

  function syncAudioState() {
    if (!audioContext) return;
    if (audioContext.state === 'running') {
      if (soundWanted && !soundOn) {
        soundOn = true;
        masterGain?.gain.setTargetAtTime(.8, audioContext.currentTime, .14);
        updateSoundUi();
        startMotif();
        removeUnlockers();
      }
      return;
    }
    if (!document.hidden && soundWanted && soundOn) {
      soundOn = false;
      stopMotif();
      updateSoundUi();
      installUnlockers();
    }
  }

  async function setSound(on, announce = true) {
    soundWanted = on;
    try { localStorage.setItem('bb48-sound-muted-v2', String(!on)); } catch {}
    if (!on) {
      soundOn = false;
      stopMotif();
      updateSoundUi();
      if (audioContext && masterGain) {
        masterGain.gain.setTargetAtTime(.0001, audioContext.currentTime, .08);
        setTimeout(() => {
          if (!soundWanted && audioContext?.state === 'running') audioContext.suspend();
        }, 420);
      }
      return false;
    }
    if (soundOn) return true;
    if (unlockPromise) return unlockPromise;
    unlockPromise = (async () => {
      try {
        buildSoundscape();
        if (!soundStateBound) {
          audioContext.addEventListener('statechange', syncAudioState);
          soundStateBound = true;
        }
        if (audioContext.state !== 'running') await audioContext.resume();
        if (audioContext.state !== 'running') throw new Error('Audio is waiting for interaction');
        soundOn = true;
        masterGain.gain.setTargetAtTime(.8, audioContext.currentTime, .14);
        updateSoundUi();
        playOpening();
        startMotif();
        if (announce) showToast();
        return true;
      } catch {
        handleSoundFailure();
        return false;
      } finally {
        unlockPromise = null;
      }
    })();
    return unlockPromise;
  }

  async function unlockFromGesture(event) {
    if (!soundWanted || soundOn) return;
    if (event.type === 'keydown' && ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(event.key)) return;
    if (event.target?.closest?.('.industry-sound')) return;
    if (await setSound(true)) removeUnlockers();
  }

  function installUnlockers() {
    if (unlockersInstalled || soundOn || !soundWanted) return;
    addEventListener('click', unlockFromGesture, true);
    addEventListener('keydown', unlockFromGesture, true);
    unlockersInstalled = true;
  }

  function removeUnlockers() {
    if (!unlockersInstalled) return;
    removeEventListener('click', unlockFromGesture, true);
    removeEventListener('keydown', unlockFromGesture, true);
    unlockersInstalled = false;
  }

  soundButton.addEventListener('click', async () => {
    const started = await setSound(!soundOn);
    if (started || !soundWanted) removeUnlockers();
  });
  updateSoundUi();
  installUnlockers();

  document.querySelectorAll('a, button').forEach(element => {
    if (element === soundButton) return;
    element.addEventListener('click', () => playTone(basePitch * 8, 0, .12, .012));
  });

  if ('IntersectionObserver' in window) {
    document.querySelectorAll('.hero, .paper, .night, .cta').forEach((section, index) => {
      new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || !soundOn || !audioContext) return;
        const multiplier = 1 + (index % 4) * .085;
        oscillators[0]?.frequency.setTargetAtTime(basePitch * multiplier, audioContext.currentTime, .7);
        oscillators[1]?.frequency.setTargetAtTime(basePitch * 1.5 * multiplier, audioContext.currentTime, .8);
        filter?.frequency.setTargetAtTime(480 + (index % 5) * 115, audioContext.currentTime, .7);
        playTone(basePitch * 6 * multiplier, 0, .22, .008);
      }, { threshold: .32 }).observe(section);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (!audioContext || !masterGain) return;
    if (document.hidden) {
      stopMotif();
      masterGain.gain.setTargetAtTime(.0001, audioContext.currentTime, .06);
      setTimeout(() => {
        if (document.hidden && audioContext.state === 'running') audioContext.suspend();
      }, 320);
    } else if (soundWanted && soundOn) {
      audioContext.resume().then(() => {
        masterGain.gain.setTargetAtTime(.8, audioContext.currentTime, .14);
        startMotif();
      }).catch(handleSoundFailure);
    }
  });

  const device = document.querySelector('.device');
  if (device && !reducedMotion && matchMedia('(pointer:fine)').matches) {
    device.addEventListener('pointermove', event => {
      const rect = device.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      device.style.transform = `perspective(1200px) rotateY(${x * 5 - 3}deg) rotateX(${2 - y * 4}deg) translateY(-3px)`;
    });
    device.addEventListener('pointerleave', () => { device.style.transform = ''; });
  }

  let chatBusy = false;
  const launcher = dock.querySelector('.niche-ai-launch');
  const closeButton = chat.querySelector('.niche-chat-close');
  const messages = chat.querySelector('.niche-chat-messages');
  const form = chat.querySelector('.niche-chat-form');
  const input = chat.querySelector('#niche-chat-input');
  const submit = form.querySelector('button');
  const starters = chat.querySelectorAll('.niche-starter');
  const history = [];
  const backgroundSurfaces = [header, document.querySelector('main'), document.querySelector('.footer'), dock].filter(Boolean);

  function setChatOpen(open) {
    chat.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    body.classList.toggle('chat-open', open);
    backgroundSurfaces.forEach(element => { element.inert = open; });
    if (open) setTimeout(() => input.focus({ preventScroll: true }), 60);
    else launcher.focus({ preventScroll: true });
  }

  function trimHistory() {
    const totalCharacters = () => history.reduce((total, item) => total + item.content.length, 0);
    while ((history.length > 8 || totalCharacters() > 4800) && history.length > 2) history.splice(0, 2);
  }

  function appendMessage(role, text, error = false) {
    const message = document.createElement('div');
    message.className = `niche-message ${role}${error ? ' error' : ''}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  async function sendMessage(raw) {
    const message = String(raw || '').trim();
    if (!message || chatBusy) return;
    chatBusy = true;
    submit.disabled = true;
    input.disabled = true;
    appendMessage('user', message);
    const historyBeforeSend = history.slice();
    history.push({ role: 'user', content: `${nicheName} website context: ${message}` });
    trimHistory();
    const pending = appendMessage('assistant', 'Thinking…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('The AI adviser is busy for a moment.');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          pending.textContent = reply;
        }
        reply += decoder.decode();
      } else {
        reply = await response.text();
      }
      reply = reply.trim();
      if (!reply) throw new Error('The AI adviser is temporarily unavailable.');
      pending.textContent = reply;
      history.push({ role: 'assistant', content: reply });
      trimHistory();
      chat.querySelector('.niche-chat-meta a').href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi BusinessBoost48, I used the AI adviser about my ${nicheName.toLowerCase()} website. My question: ${message.slice(0, 260)}. AI direction: ${reply.slice(0, 240)}`)}`;
      playTone(basePitch * 8, 0, .22, .016);
    } catch (error) {
      history.splice(0, history.length, ...historyBeforeSend);
      pending.remove();
      appendMessage('assistant', error?.name === 'AbortError' ? 'The adviser took too long to reply. Please try once more or continue on WhatsApp.' : String(error?.message || 'The AI adviser is temporarily unavailable.'), true);
    } finally {
      clearTimeout(timeout);
      chatBusy = false;
      submit.disabled = false;
      input.disabled = false;
      input.value = '';
      input.focus({ preventScroll: true });
    }
  }

  launcher.addEventListener('click', () => setChatOpen(true));
  closeButton.addEventListener('click', () => setChatOpen(false));
  form.addEventListener('submit', event => {
    event.preventDefault();
    sendMessage(input.value);
  });
  starters.forEach(button => button.addEventListener('click', () => sendMessage(button.textContent)));
  document.addEventListener('keydown', event => {
    if (chat.hidden) return;
    if (event.key === 'Escape') {
      setChatOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...chat.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', scrollY > 28);
  }, { passive: true });
})();
