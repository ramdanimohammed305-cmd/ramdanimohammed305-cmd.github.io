'use strict';
const languageButtons = [...document.querySelectorAll('[data-lang]')];
const translatedNodes = [...document.querySelectorAll('[data-en]')];
translatedNodes.forEach(node => { node.dataset.fr = node.innerHTML; });
let language = 'fr';
const descriptions = {
  fr: 'Mohammed Ramdani, ingénieur de production chez Future Pipe Industries : management d’équipes, fabrication GRP, performance industrielle, maintenance et projets CAPEX.',
  en: 'Mohammed Ramdani, production engineer at Future Pipe Industries: team leadership, GRP manufacturing, industrial performance, maintenance and CAPEX projects.'
};
function setLanguage(next) {
  if (!['fr', 'en'].includes(next)) return;
  language = next;
  document.documentElement.lang = next;
  translatedNodes.forEach(node => { node.innerHTML = node.dataset[next]; });
  languageButtons.forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.lang === next)); });
  document.title = next === 'fr' ? 'Mohammed Ramdani — Ingénieur de production' : 'Mohammed Ramdani — Production Engineer';
  document.querySelector('meta[name="description"]').content = descriptions[next];
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = descriptions[next];
  document.querySelector('.brand').setAttribute('aria-label', next === 'fr' ? 'Mohammed Ramdani, accueil' : 'Mohammed Ramdani, home');
  document.querySelector('#navigation').setAttribute('aria-label', next === 'fr' ? 'Navigation principale' : 'Main navigation');
  document.querySelector('.hero-visual img').alt = next === 'fr' ? 'Illustration d’un raccord en composite renforcé de fibres de verre' : 'Illustration of a glass-fibre reinforced composite fitting';
  document.querySelector('#copy-status').textContent = '';
  try { localStorage.setItem('mr-language', next); } catch (_) { /* Language works without storage. */ }
}
languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
try { const saved = localStorage.getItem('mr-language'); if (saved === 'en') setLanguage('en'); } catch (_) { /* Keep French. */ }
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = navigation.querySelector(`a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  ['projects', 'journey', 'expertise'].forEach(id => observer.observe(document.getElementById(id)));
}
document.querySelector('#copy-email').addEventListener('click', async () => {
  const email = 'ramdanimohammed305@gmail.com';
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    status.textContent = language === 'fr' ? 'Adresse e-mail copiée.' : 'Email address copied.';
  } catch (_) {
    const range = document.createRange(); range.selectNodeContents(document.querySelector('.email-link'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    status.textContent = language === 'fr' ? 'Adresse sélectionnée. Utilisez Copier dans votre navigateur.' : 'Email selected. Use your browser’s Copy command.';
  }
});
