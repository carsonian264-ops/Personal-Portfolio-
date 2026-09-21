(() => {
  'use strict';

  const toggle = document.getElementById('ai-toggle');
  const panel = document.getElementById('ai-panel');
  const closeBtn = document.getElementById('ai-close');
  const clearBtn = document.getElementById('ai-clear');
  const log = document.getElementById('ai-log');
  const form = document.getElementById('ai-form');
  const input = document.getElementById('ai-input');
  const suggestions = document.getElementById('ai-suggestions');

  if (!toggle || !panel || !log || !form || !input) return;

  /* ----- rule-based response engine -----
     This is a local, offline pattern-matcher — not connected to a live LLM API.
     `getResponse` is the single seam to swap in a real backend call later:
     replace its body with a fetch() to your API and keep the same signature. */
  const RULES = [
    { test: /build|create|develop|capab/i, reply: 'Ian builds full-stack web apps — JavaScript/React front ends, Express/Node.js APIs, and PostgreSQL-backed data layers. See the Engineering section for a full breakdown.' },
    { test: /tech|stack|language|tool/i, reply: 'Core stack: JavaScript, React, Node.js, Express, PostgreSQL, and Git. He’s also learning Python, NumPy, pandas, and scikit-learn for AI/ML. Full details are in the Skills section.' },
    { test: /project/i, reply: 'Right now the featured project is this portfolio itself — built from scratch with no frameworks. Check the Projects section for the case study.' },
    { test: /contact|reach|email|hire/i, reply: 'Best way to reach Ian is email: carsonian264@gmail.com, or find him on GitHub at github.com/carsonian264-ops.' },
    { test: /journey|learn|experience|background/i, reply: 'Ian is self-taught, learning full-stack development and now branching into AI/ML. See the Learning Journey timeline for the full path.' },
    { test: /ai|machine learning|ml\b/i, reply: 'Ian is currently building foundations in AI/ML with Python — NumPy, pandas, and scikit-learn. It’s a current focus, not yet a specialization.' },
    { test: /cv|resume/i, reply: 'A downloadable CV isn’t uploaded yet — the button in the hero section is ready for one once it exists.' },
    { test: /^(hi|hello|hey)\b/i, reply: 'Hey! 👋 Ask me about Carson’s skills, projects, or how to get in touch.' },
  ];
  const FALLBACK = "I don't have an answer for that yet — try asking about his skills, projects, or how to contact him.";

  function getResponse(message) {
    const rule = RULES.find(r => r.test.test(message));
    return Promise.resolve(rule ? rule.reply : FALLBACK);
  }

  function addMessage(text, role) {
    const msg = document.createElement('p');
    msg.className = `ai-msg ai-msg--${role}`;
    msg.textContent = text;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'ai-typing';
    typing.setAttribute('aria-label', 'Assistant is typing');
    typing.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    return typing;
  }

  function welcome() {
    log.innerHTML = '';
    addMessage("Hi! 👋 Ask me about Carson's skills, projects, and development journey.", 'bot');
  }

  async function handleMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, 'user');
    input.value = '';
    input.focus();

    const typing = showTyping();
    try {
      const reply = await getResponse(trimmed);
      await new Promise(r => setTimeout(r, 350));
      typing.remove();
      addMessage(reply, 'bot');
    } catch (err) {
      typing.remove();
      addMessage('Something went wrong answering that — try again in a moment.', 'error');
    }
  }

  function openPanel() {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    toggle.setAttribute('aria-expanded', 'true');
    if (!log.children.length) welcome();
    input.focus();
  }
  function closePanel() {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
    setTimeout(() => { panel.hidden = true; }, 250);
  }

  toggle.addEventListener('click', () => {
    panel.hidden ? openPanel() : closePanel();
  });
  closeBtn?.addEventListener('click', closePanel);
  clearBtn?.addEventListener('click', welcome);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    handleMessage(input.value);
  });

  suggestions?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-q]');
    if (btn) handleMessage(btn.dataset.q);
  });
})();
