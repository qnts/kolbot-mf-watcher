import { Liquid } from 'liquidjs';
import { runes, itemRegex, isHR } from '../../services/GameData';
import moment from 'moment';

export const liquid = new Liquid();

const white = 'white';
const blue = 'blue';
const red = 'red';
const orange = 'orange';

const whiteMods = [
  /defense:/i,
  /durability:/i,
  /(one-hand|two-hand|throw) damage/i,
  /required /i,
  / class.*attack speed$/i,
  /chance to block:/i,
  /smite damage/i,
  /quantity: /i,
  // runes / gems / jewels
  /can be inserted/i,
  /armor: /i,
  /helms: /i,
  /shields: /i,
  /weapons: /i,
  /keep in inventory/i,
];
const redMods = /^\([a-z]+ only\)|unidentified$/i;

liquid.registerFilter('mod_color', (mod, isRune) => {
  const lmod = mod.toLowerCase();
  let color = blue;
  // runes line of a runeword
  if (/^'[a-z]+'$/i.test(lmod)) {
    color = orange;
  } else if (isRune) {
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

export const formatItemStats = item => {
  /*
  {
    color: string,
    text: string,
    ltext: string,
    formatted: string,
  }
  */
  const newStats = [];
  const meta = {
    blueDefense: false,
    blueDamage: false,
    hasIAS: false,
  };
  item.stats.forEach(s => {
    const stat = {
      color: blue,
      text: s,
      ltext: s.toLowerCase(),
      formatted: '',
      isBase: false,
    };
    if (/^'[a-z]+'$/i.test(stat.ltext)) { // runeword's runes
      stat.color = orange;
    } else if (item.isRune) {
      stat.color = white;
    } else if (redMods.test(stat.ltext)) { // [soceress only]
      stat.color = red;
    } else if (itemRegex.test(stat.ltext.replace(/\s+/, ''))) { // item base name (shako, archonplate, ...)
      stat.color = white;
      stat.isBase = true;
    } else {
      for (const r of whiteMods) {
        if (r.test(stat.ltext)) {
          stat.color = white;
          break;
        }
      }
    }
    // meta
    if (/^\+[0-9]+%?\s*(enhanced)?\s*(defense$|defense \()/i.test(stat.ltext)) {
      meta.blueDefense = true;
    }
    if (
      /^\+[0-9]+%? (to|enhanced)\s*(minimum|maximum)? damage/i.test(stat.ltext) ||
      /^add [0-9]+-[0-9]+ damage$/i.test(stat.ltext)
    ) {
      meta.blueDamage = true;
    }
    if (/increased attack speed/i.test(stat.ltext)) {
      meta.hasIAS = true;
    }
    newStats.push(stat);
  });
  // we traverse again to really format
  newStats.forEach(stat => {
    // format a portion of text
    /*
      chance to block: blue
      defense: blue (if has enhance defense/ +x defense / +x defense (based on level))
      one|two hand damage: blue (if has min/max dmg/enhance damage)
      <item> class - blue (attack speed if has increased attack speed)
    */
    if (stat.color === white) {
      if (/chance to block:/i.test(stat.ltext)) {
        stat.formatted = highlight(stat.text, /([0-9]+%)/, white, blue);
      } else if (/defense:/i.test(stat.ltext) && meta.blueDefense) {
        stat.formatted = highlight(stat.text, /([0-9]+)/, white, blue);
      } else if (/(one-hand|two-hand|throw) damage/i.test(stat.ltext) && meta.blueDamage) {
        stat.formatted = highlight(stat.text, /([0-9]+ to [0-9]+)/, white, blue);
      } else if (/ class.*attack speed$/i.test(stat.ltext) && meta.hasIAS) {
        stat.formatted = highlight(stat.text, /((very )?(slow|normal|fast) attack speed)/i, white, blue);
      } else if (stat.isBase && item.isRuneword) {
        stat.formatted = `<span class="color-gray">${stat.text}</span>`;
      } else {
        stat.formatted = `<span class="mod-${stat.color}">${stat.text}</span>`;
      }
    } else {
      stat.formatted = `<span class="mod-${stat.color}">${stat.text}</span>`;
    }
  });
  item.stats = newStats.map(s => s.formatted);
};

function highlight(text, regex, color, highlightColor) {
  return `<span class="mod-${color}">${text.replace(regex, `<span class="mod-${highlightColor}">$1</span>`)}</span>`;
}
