(() => {
  'use strict';

  const GITHUB_USER = 'carsonian264-ops';
  const content = document.getElementById('github-content');
  if (!content) return;

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(c));
    return node;
  }

  function renderError() {
    content.innerHTML = '';
    const wrap = el('div', { class: 'github-error' });

    const alertIcon = el('svg', { class: 'icon', 'aria-hidden': 'true' });
    alertIcon.innerHTML = '<use href="#i-alert"></use>';
    wrap.appendChild(alertIcon);

    wrap.appendChild(el('p', { text: "Live GitHub data couldn't be loaded right now (rate limit or network)." }));

    const link = el('a', { href: `https://github.com/${GITHUB_USER}`, target: '_blank', rel: 'noopener noreferrer', class: 'btn btn-ghost btn-sm' });
    const githubIcon = el('svg', { class: 'icon', 'aria-hidden': 'true' });
    githubIcon.innerHTML = '<use href="#i-github"></use>';
    link.appendChild(githubIcon);
    link.appendChild(document.createTextNode(' View profile on GitHub'));
    wrap.appendChild(link);

    content.appendChild(wrap);
  }

  function timeAgo(dateStr) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days < 1) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  }

  async function load() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers: { Accept: 'application/vnd.github+json' } }),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`, { headers: { Accept: 'application/vnd.github+json' } }),
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

      const user = await userRes.json();
      const repos = await reposRes.json();

      const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
      const joinedYear = new Date(user.created_at).getFullYear();

      content.innerHTML = '';
      const dl = el('dl');
      const rows = [
        ['Public repositories', String(user.public_repos ?? repos.length)],
        ['Languages seen', languages.length ? languages.join(', ') : '—'],
        ['On GitHub since', String(joinedYear)],
        ['Followers', String(user.followers ?? 0)],
      ];
      rows.forEach(([label, value]) => {
        const row = el('div', { class: 'github-row' });
        row.appendChild(el('dt', { text: label }));
        row.appendChild(el('dd', { text: value }));
        dl.appendChild(row);
      });
      content.appendChild(dl);

      if (repos.length) {
        const list = el('div', { class: 'github-repos' });
        repos.slice(0, 4).forEach(repo => {
          const link = el('a', {
            class: 'github-repo-link',
            href: repo.html_url,
            target: '_blank',
            rel: 'noopener noreferrer',
          });
          link.appendChild(el('span', { text: repo.name }));
          const meta = el('span', { class: 'github-lang' });
          meta.textContent = [repo.language, `updated ${timeAgo(repo.updated_at)}`].filter(Boolean).join(' · ');
          link.appendChild(meta);
          list.appendChild(link);
        });
        content.appendChild(list);
      }
    } catch (err) {
      renderError();
    }
  }

  load();
})();
