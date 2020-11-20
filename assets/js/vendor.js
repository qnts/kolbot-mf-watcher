import { Liquid } from 'liquidjs';
import { runes } from '../../services/GameData';

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
];
const redMods = /^\([a-z]+ only\)$/i;

liquid.registerFilter('mod_color', mod => {
  const lmod = mod.toLowerCase();
  let color = blue;
  if (redMods.test(lmod)) {
    color = red;
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
