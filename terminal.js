(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero terminal: typing animation ---------- */
  const heroTerminal = document.getElementById('hero-terminal');
  const heroLines = [
    { cmd: 'whoami', out: 'Full-Stack Engineer' },
    { cmd: 'current_focus', out: 'Full-Stack + AI' },
    { cmd: 'status', out: 'Building...' },
  ];

  function renderStatic(el, lines) {
    el.textContent = lines.map(l => `$ ${l.cmd}\n> ${l.out}`).join('\n\n');
  }

  async function typeLine(el, text, speed) {
    for (let i = 0; i <= text.length; i++) {
      el.textContent += text[i - 1] ?? '';
      await new Promise(r => setTimeout(r, speed));
    }
  }

  async function runHeroTyping() {
    if (!heroTerminal) return;
    if (prefersReducedMotion) { renderStatic(heroTerminal, heroLines); return; }

    heroTerminal.textContent = '';
    for (const line of heroLines) {
      heroTerminal.textContent += '$ ';
      await typeLine(heroTerminal, line.cmd, 45);
      await new Promise(r => setTimeout(r, 220));
      heroTerminal.textContent += '\n> ';
      await typeLine(heroTerminal, line.out, 20);
      heroTerminal.textContent += '\n\n';
      await new Promise(r => setTimeout(r, 350));
    }
  }

  if (heroTerminal && 'IntersectionObserver' in window) {
    let started = false;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          runHeroTyping();
        }
      });
    }, { threshold: 0.4 });
    io.observe(heroTerminal);
  } else if (heroTerminal) {
    renderStatic(heroTerminal, heroLines);
  }

  /* ---------- Interactive dev terminal ---------- */
  const log = document.getElementById('dev-terminal-log');
  const input = document.getElementById('dev-terminal-input');
  if (!log || !input) return;

  const commands = {
    whoami: 'Ian Carson — Full-Stack Engineer, based in Kenya.',
    stack: 'JavaScript, React, Node.js, Express, PostgreSQL, Python.',
    focus: 'Full-stack development + AI/ML fundamentals.',
    status: 'BUILDING · LEARNING · IMPROVING',
    projects: 'See the Projects section above, or run: open projects',
    contact: 'Email: carsonian264@gmail.com · GitHub: github.com/carsonian264-ops',
    help: 'Available commands: whoami, stack, focus, status, projects, contact, clear, help',
  };

  function appendLine(text, className) {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function printWelcome() {
    appendLine("Type 'help' to see available commands.", 'cmd-out');
  }
  printWelcome();

  function handleCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    appendLine(`$ ${cmd}`, 'cmd-line');

    const key = cmd.toLowerCase();
    if (key === 'clear') {
      log.innerHTML = '';
      printWelcome();
      return;
    }
    if (key === 'open projects') {
      appendLine('Scrolling to Projects…', 'cmd-out');
      document.getElementById('projects')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }
    if (commands[key]) {
      appendLine(commands[key], 'cmd-out');
      return;
    }
    appendLine(`command not found: ${cmd} — type 'help' for available commands`, 'cmd-out');
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    }
  });
})();
