import { Liquid } from 'liquidjs';
import { runes, itemRegex, isHR } from '../../services/GameData';
import moment from 'moment';

export const liquid = new Liquid();

const white = 'white';
const blue = 'blue';
const red = 'red';

const whiteMods = [
  /defense:/i,
  /durability:/i,
  /(one|two)-hand damage/i,
  /required /i,
  / class.*attack speed$/i,
  /chance to block:/i,
  /smite damage/i,
  // runes / gems / jewels
  /can be inserted/i,
  /armor: /i,
  /helms: /i,
  /shields: /i,
  /weapons: /i,
  /keep in inventory/i,
];
const redMods = /^\([a-z]+ only\)$/i;

liquid.registerFilter('mod_color', (mod, isRune) => {
  const lmod = mod.toLowerCase();
  let color = blue;
  if (isRune) {
    color = white;
  } else if (redMods.test(lmod)) {
    color = red;
  } else if (itemRegex.test(lmod.replace(/\s+/, ''))) {
    color = white;
  } else {
    for (const r of whiteMods) {
      if (r.test(lmod)) {
        color = white;
        break;
      }
    }
  }
  return `<span class="mod-${color}">${mod}</span>`;
});

liquid.registerFilter('deco_rune', name => {
  return runes.includes(name) ? `<span class="color-unique">${name}</span>` : name;
});

liquid.registerFilter('deco_hr_class', name => {
  return isHR(name) ? 'item-hr' : '';
});

liquid.registerFilter('page_label', (page, readable) => {
  if (page === 'p') {
    return readable ? 'Previous' : '&larr;';
  }
  if (page === 'n') {
    return readable ? 'Next' : '&rarr;';
  }
  if (page === '...') {
    return readable ? '' : '&hellip;';
  }
  return readable ? `Page ${page}` : page;
});

liquid.registerFilter('moment', (date, format) => {
  return moment(date).format(format);
});
