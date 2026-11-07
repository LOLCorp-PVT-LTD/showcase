/* LOLCorp showcase embed: renders the live list of showcase pieces on any page.
   Usage: <div id="lolcorp-showcase"></div><script src="https://showcase.lolcorp.co.uk/embed.js" defer></script>
   Options on the div: data-limit="6" (how many to show), data-theme="dark" or "light".
   Restyle by overriding the --lcs-* CSS variables on #lolcorp-showcase. */
(function () {
  var BASE = 'https://showcase.lolcorp.co.uk/';
  var el = document.getElementById('lolcorp-showcase');
  if (!el) return;
  var limit = parseInt(el.getAttribute('data-limit') || '0', 10);
  var dark = (el.getAttribute('data-theme') || 'dark') !== 'light';
  var css = '#lolcorp-showcase{--lcs-bg:' + (dark ? '#0e4444' : '#ffffff') + ';--lcs-ink:' + (dark ? '#f4f7f6' : '#0a2a2a') + ';--lcs-mute:' + (dark ? '#9fbcb8' : '#5b6b6b') + ';--lcs-line:' + (dark ? '#ffffff1a' : '#00000014') + ';--lcs-accent:#2fd1b0;--lcs-radius:22px;--lcs-gap:20px}' +
    '#lolcorp-showcase .lcs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--lcs-gap)}' +
    '#lolcorp-showcase .lcs-card{display:flex;flex-direction:column;background:var(--lcs-bg);color:var(--lcs-ink);border:1px solid var(--lcs-line);border-radius:var(--lcs-radius);overflow:hidden;text-decoration:none;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}' +
    '#lolcorp-showcase .lcs-card:hover{transform:translateY(-6px);box-shadow:0 30px 60px #0005}' +
    '#lolcorp-showcase video{display:block;width:100%;aspect-ratio:9/16;object-fit:cover;background:#000}' +
    '#lolcorp-showcase .lcs-meta{padding:16px 18px 20px}#lolcorp-showcase small{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--lcs-mute)}' +
    '#lolcorp-showcase h3{margin:8px 0 6px;font-size:22px;line-height:1.1}#lolcorp-showcase p{margin:0;font-size:14px;line-height:1.5;color:var(--lcs-mute)}' +
    '#lolcorp-showcase .lcs-go{display:inline-block;margin-top:12px;font-size:13px;font-weight:600;color:var(--lcs-accent)}' +
    '#lolcorp-showcase .lcs-new{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:99px;background:var(--lcs-accent);color:#062b2b;font-size:10px;letter-spacing:.08em}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function render(feed) {
    var items = feed.items || []; if (limit) items = items.slice(0, limit);
    var html = '<div class="lcs-grid">' + items.map(function (it, i) {
      return '<a class="lcs-card" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
        '<video muted loop playsinline preload="none" poster="' + esc(it.poster) + '" src="' + esc(it.reel) + '"></video>' +
        '<div class="lcs-meta"><small>' + esc(it.kind) + (i === 0 ? '<span class="lcs-new">NEW</span>' : '') + '</small><h3>' + esc(it.title) + '</h3><p>' + esc(it.blurb) + '</p><span class="lcs-go">Open live demo →</span></div></a>';
    }).join('') + '</div>';
    el.innerHTML = html;
    var vids = el.querySelectorAll('video');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: .4 });
    Array.prototype.forEach.call(vids, function (v) { io.observe(v); });
  }
  // always fetch the latest feed (no cache), so new pieces appear as soon as the showcase deploys
  fetch(BASE + 'feed.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(render).catch(function () { el.innerHTML = '<p><a href="' + BASE + '">See our latest work →</a></p>'; });
})();
