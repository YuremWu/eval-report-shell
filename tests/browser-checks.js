window.checkEvalReport = async function () {
  const results = [];
  const check = (name, value) => { if (!value) throw Error(name); results.push(name); };
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const root = document.querySelector('.er');
  const sheet = () => document.querySelector('.sheet');
  const cards = [...document.querySelectorAll('.row:not(.group)')];

  check('one donut', document.querySelectorAll('.donut').length === 1);
  check('every card is one row: title, bar, percent', cards.length === 7 && cards.every(r => r.querySelector('.name').textContent.trim() && r.querySelector('.bar') && /%$/.test(r.querySelector('.num').textContent)));
  check('titles drop the id prefix and scenario count', cards[0].querySelector('.name').textContent === 'A1-6Failed card');
  check('one bar segment per scenario', cards[0].querySelectorAll('.bar > *').length === 3 && cards[0].querySelectorAll('.bar > .failed').length === 2);
  check('failed cards come first', cards[0].classList.contains('failed') && cards[1].classList.contains('unknown'));
  check('layer 1 carries no dialogue or reasons', !root.textContent.includes('Wrong name') && !root.textContent.includes('Name differs'));
  check('group rows with percent', document.querySelectorAll('.row.group').length === 2 && document.querySelector('.row.group .num').textContent === '75%');

  cards[0].click();
  check('card click opens the sheet', sheet() && sheet().getAttribute('role') === 'dialog');
  const mark = sheet().querySelector('mark');
  check('problem quote is marked and underlined', mark.textContent === 'Wrong name' && getComputedStyle(mark).textDecorationLine.includes('underline'));
  check('reason is shown once', sheet().textContent.split('Name differs').length === 2);
  check('mismatched quote is not marked', ![...sheet().querySelectorAll('mark')].some(n => n.textContent === 'Fabricated quote'));
  check('mismatch is disclosed', sheet().querySelector('.miss').textContent.includes('Fabricated quote'));
  check('failing scenario without a quote is still named', [...sheet().querySelectorAll('.scene h4')].some(n => n.textContent === 'Home'));
  const full = sheet().querySelector('.all'), more = sheet().querySelector('.more');
  check('full dialogue starts folded', full.hidden && more.getAttribute('aria-expanded') === 'false');
  more.click();
  check('full dialogue opens below, inside the sheet', !full.hidden && sheet().contains(full) && full.querySelectorAll('.pair').length === 3
    && (more.compareDocumentPosition(full) & Node.DOCUMENT_POSITION_FOLLOWING));
  check('marks stay in the full dialogue', full.querySelector('mark')?.textContent === 'Wrong name');
  await wait(50);
  const box = sheet().getBoundingClientRect();
  check('sheet stays inside the viewport and scrolls', box.top >= 0 && box.bottom <= innerHeight && getComputedStyle(sheet()).overflowY === 'auto');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  check('Escape closes and restores focus', !sheet() && document.activeElement === cards[0]);

  document.querySelector('.legend .passed').click();
  check('legend lists the cards of one status', sheet().querySelectorAll('.row').length === 5 && sheet().querySelector('h3').textContent.includes('5'));
  sheet().querySelector('.row').click();
  check('a passed card shows its dialogue directly', !sheet().querySelector('.more') && sheet().querySelectorAll('.all .pair').length === 2 && !sheet().querySelector('.all').hidden);
  document.querySelector('.veil').click();
  check('outside click closes', !sheet());

  document.querySelector('.donut [data-s="unknown"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  check('donut segment lists its cards', sheet().querySelectorAll('.row').length === 1);
  sheet().querySelector('.row').click();
  check('unknown uses the warning tone', getComputedStyle(sheet().querySelector('.scene')).getPropertyValue('--tone').trim() === getComputedStyle(document.documentElement).getPropertyValue('--er-warn').trim());
  sheet().querySelector('.x').click();

  document.querySelector('.row.group .bar .failed').click();
  check('group segment lists that group only', sheet().querySelector('h3').textContent.startsWith('A1') && sheet().querySelectorAll('.row').length === 1);
  sheet().querySelector('.x').click();
  return results;
};
