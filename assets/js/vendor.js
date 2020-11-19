import { Liquid } from 'liquidjs';

export const liquid = new Liquid();

const white = 'white';
const blue = 'blue';

const whiteMods = [
  /defense/i,
  /durability/i,
  /(one|two)-hand damage/i,
  /required /i,
  / class.*attack speed$/i,
  /chance to block:/i,
  /smite damage/i,
  /\[[a-z]+ only\]/i,
  // runes
  /armor: /i,
  /helms: /i,
  /shields: /i,
  /weapons: /i,
];

liquid.registerFilter('mod_color', mod => {
  const lmod = mod.toLowerCase();
  let color = blue;
  for (const r of whiteMods) {
    if (r.test(lmod)) {
      color = white;
      break;
    }
  }
  return `<span class="mod-${color}">${mod}</span>`;
});
