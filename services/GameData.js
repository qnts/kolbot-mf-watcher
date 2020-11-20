export const runes = [
  'El', 'Eld', 'Tir', 'Nef', 'Eth', 'Ith', 'Tal', 'Ral', 'Ort',
  'Thul', 'Amn', 'Sol', 'Shael', 'Dol', 'Hel', 'Io', 'Lum', 'Ko',
  'Fal', 'Lem', 'Pul', 'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
  'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod'].map(n => `${n} Rune`);

export const isHR = r => {
  const runeIndex = runes.findIndex(i => i === r) + 1;
  return runeIndex >= 23; // mal
};

export const itemQualities = [
  'lowquality', 'normal',
  'superior', 'magic', 'set',
  'rare', 'unique', 'crafted',
];

export const actions = [
  'Kept', 'Sold', 'Dropped', 'Cubing-Kept',
];

export const baseItems = [
  'handaxe','axe','doubleaxe','militarypick','waraxe','largeaxe',
  'broadaxe','battleaxe','greataxe','giantaxe','wand','yewwand',
  'bonewand','grimwand','club','scepter','grandscepter','warscepter',
  'spikedclub','mace','morningstar','flail','warhammer','maul','greatmaul',
  'shortsword','scimitar','sabre','falchion','crystalsword','broadsword',
  'longsword','warsword','twohandedsword','claymore','giantsword',
  'bastardsword','flamberge','greatsword','dagger','dirk','kris',
  'blade','throwingknife','throwingaxe','balancedknife','balancedaxe',
  'javelin','pilum','shortspear','glaive','throwingspear','spear',
  'trident','brandistock','spetum','pike','bardiche','voulge',
  'scythe','poleaxe','halberd','warscythe','shortstaff','longstaff',
  'gnarledstaff','battlestaff','warstaff','shortbow','hunter\'sbow',
  'longbow','compositebow','shortbattlebow','longbattlebow',
  'shortwarbow','longwarbow','lightcrossbow','crossbow','heavycrossbow',
  'repeatingcrossbow','rancidgaspotion','oilpotion','chokinggaspotion',
  'explodingpotion','stranglinggaspotion','fulminatingpotion',
  'decoygidbinn','thegidbinn','wirt\'sleg','horadricmalus',
  'hellforgehammer','horadricstaff','shaftofthehoradricstaff','hatchet',
  'cleaver','twinaxe','crowbill','naga','militaryaxe','beardedaxe',
  'tabar','gothicaxe','ancientaxe','burntwand','petrifiedwand',
  'tombwand','gravewand','cudgel','runescepter','holywatersprinkler',
  'divinescepter','barbedclub','flangedmace','jaggedstar','knout',
  'battlehammer','warclub','marteldefer','gladius','cutlass','shamshir',
  'tulwar','dimensionalblade','battlesword','runesword','ancientsword',
  'espandon','dacianfalx','tusksword','gothicsword','zweihander',
  'executionersword','poignard','rondel','cinquedeas','stiletto',
  'battledart','francisca','wardart','hurlbat','warjavelin',
  'greatpilum','simbilan','spiculum','harpoon','warspear',
  'fuscina','warfork','yari','lance','lochaberaxe','bill',
  'battlescythe','partizan','becdecorbin','grimscythe',
  'jostaff','quarterstaff','cedarstaff','gothicstaff',
  'runestaff','edgebow','razorbow','cedarbow','doublebow',
  'shortsiegebow','largesiegebow','runebow','gothicbow',
  'arbalest','siegecrossbow','ballista','chukonu','khalim\'sflail',
  'khalim\'swill','katar','wristblade','hatchethands','cestus',
  'claws','bladetalons','scissorskatar','quhab','wristspike','fascia',
  'handscythe','greaterclaws','greatertalons','scissorsquhab',
  'suwayyah','wristsword','warfist','battlecestus','feralclaws',
  'runictalons','scissorssuwayyah','tomahawk','smallcrescent',
  'ettinaxe','warspike','berserkeraxe','feralaxe','silveredgedaxe',
  'decapitator','championaxe','gloriousaxe','polishedwand',
  'ghostwand','lichwand','unearthedwand','truncheon',
  'mightyscepter','seraphrod','caduceus','tyrantclub',
  'reinforcedmace','devilstar','scourge','legendarymallet',
  'ogremaul','thundermaul','falcata','ataghan','elegantblade',
  'hydraedge','phaseblade','conquestsword','crypticsword',
  'mythicalsword','legendsword','highlandblade','balrogblade',
  'championsword','colossussword','colossusblade','boneknife',
  'mithrilpoint','fangedknife','legendspike','flyingknife',
  'flyingaxe','wingedknife','wingedaxe','hyperionjavelin',
  'stygianpilum','balrogspear','ghostglaive','wingedharpoon',
  'hyperionspear','stygianpike','mancatcher','ghostspear',
  'warpike','ogreaxe','colossusvoulge','thresher','crypticaxe',
  'greatpoleaxe','giantthresher','walkingstick','stalagmite',
  'elderstaff','shillelagh','archonstaff','spiderbow','bladebow',
  'shadowbow','greatbow','diamondbow','crusaderbow','wardbow',
  'hydrabow','pelletbow','gorgoncrossbow','colossuscrossbow',
  'demoncrossbow','eagleorb','sacredglobe','smokedsphere',
  'claspedorb','jared\'sstone','stagbow','reflexbow','maidenspear',
  'maidenpike','maidenjavelin','glowingorb','crystallineglobe',
  'cloudysphere','sparklingball','swirlingcrystal','ashwoodbow',
  'ceremonialbow','ceremonialspear','ceremonialpike',
  'ceremonialjavelin','heavenlystone','eldritchorb','demonheart',
  'vortexorb','dimensionalshard','matriarchalbow','grandmatronbow',
  'matriarchalspear','matriarchalpike','matriarchaljavelin','cap',
  'skullcap','helm','fullhelm','greathelm','crown','mask',
  'quiltedarmor','leatherarmor','hardleatherarmor','studdedleather',
  'ringmail','scalemail','chainmail','breastplate','splintmail',
  'platemail','fieldplate','gothicplate','fullplatemail',
  'ancientarmor','lightplate','buckler','smallshield','largeshield',
  'kiteshield','towershield','gothicshield','leathergloves',
  'heavygloves','chaingloves','lightgauntlets','gauntlets','boots',
  'heavyboots','chainboots','lightplatedboots','greaves','sash',
  'lightbelt','belt','heavybelt','platedbelt','bonehelm',
  'boneshield','spikedshield','warhat','sallet','casque',
  'basinet','wingedhelm','grandcrown','deathmask','ghostarmor',
  'serpentskinarmor','demonhidearmor','trellisedarmor',
  'linkedmail','tigulatedmail','mesharmor','cuirass',
  'russetarmor','templarcoat','sharktootharmor','embossedplate',
  'chaosarmor','ornateplate','mageplate','defender','roundshield',
  'scutum','dragonshield','pavise','ancientshield','demonhidegloves',
  'sharkskingloves','heavybracers','battlegauntlets','wargauntlets',
  'demonhideboots','sharkskinboots','meshboots','battleboots',
  'warboots','demonhidesash','sharkskinbelt','meshbelt','battlebelt',
  'warbelt','grimhelm','grimshield','barbedshield','wolfhead',
  'hawkhelm','antlers','falconmask','spiritmask','jawbonecap',
  'fangedhelm','hornedhelm','assaulthelmet','avengerguard','targe',
  'rondache','heraldicshield','aerinshield','crownshield',
  'preservedhead','zombiehead','unravellerhead','gargoylehead',
  'demonhead','circlet','coronet','tiara','diadem','shako',
  'hydraskull','armet','giantconch','spiredhelm','corona',
  'demonhead','duskshroud','wyrmhide','scarabhusk','wirefleece',
  'diamondmail','loricatedmail','boneweave','greathauberk',
  'balrogskin','hellforgeplate','krakenshell','lacqueredplate',
  'shadowplate','sacredarmor','archonplate','heater','luna',
  'hyperion','monarch','aegis','ward','bramblemitts',
  'vampirebonegloves','vambraces','crusadergauntlets',
  'ogregauntlets','wyrmhideboots','scarabshellboots',
  'boneweaveboots','mirroredboots','myrmidongreaves',
  'spiderwebsash','vampirefangbelt','mithrilcoil','trollbelt',
  'colossusgirdle','bonevisage','trollnest','bladebarrier',
  'alphahelm','griffonheaddress','hunter\'sguise',
  'sacredfeathers','totemicmask','jawbonevisor','lionhelm',
  'ragemask','savagehelmet','slayerguard','akarantarge',
  'akaranrondache','protectorshield','gildedshield',
  'royalshield','mummifiedtrophy','fetishtrophy','sextontrophy',
  'cantortrophy','hierophanttrophy','bloodspirit','sunspirit',
  'earthspirit','skyspirit','dreamspirit','carnagehelm',
  'furyvisor','destroyerhelm','conquerorcrown','guardiancrown',
  'sacredtarge','sacredrondache','kurastshield','zakarumshield',
  'vortexshield','minionskull','hellspawnskull','overseerskull',
  'succubusskull','bloodlordskull','elixir','staminapotion',
  'antidotepotion','rejuvenationpotion','fullrejuvenationpotion',
  'thawingpotion','tomeoftownportal','tomeofidentify','amulet',
  'topofthehoradricstaff','ring','gold','scrollofinifuss',
  'keytothecairnstones','arrows','torch','bolts',
  'scrolloftownportal','scrollofidentify','heart','brain',
  'jawbone','eye','horn','tail','flag','fang','quill','soul',
  'scalp','spleen','theblacktowerkey','potionoflife',
  'ajadefigurine','thegoldenbird','lamesen\'stome','horadriccube',
  'horadricscroll','mephisto\'ssoulstone','bookofskill',
  'khalim\'seye','khalim\'sheart','khalim\'sbrain',
  'chippedamethyst','flawedamethyst','amethyst',
  'flawlessamethyst','perfectamethyst','chippedtopaz',
  'flawedtopaz','topaz','flawlesstopaz','perfecttopaz',
  'chippedsapphire','flawedsapphire','sapphire',
  'flawlesssapphire','perfectsapphire','chippedemerald',
  'flawedemerald','emerald','flawlessemerald','perfectemerald',
  'chippedruby','flawedruby','ruby','flawlessruby','perfectruby',
  'chippeddiamond','flaweddiamond','diamond','flawlessdiamond',
  'perfectdiamond','minorhealingpotion','lighthealingpotion',
  'healingpotion','greaterhealingpotion','superhealingpotion',
  'minormanapotion','lightmanapotion','manapotion',
  'greatermanapotion','supermanapotion','chippedskull',
  'flawedskull','skull','flawlessskull','perfectskull',
  'herb','smallcharm','largecharm','grandcharm','jewel',
  'malah\'spotion','scrollofknowledge','scrollofresistance',
  'keyofterror','keyofhate','keyofdestruction','diablo\'shorn',
  'baal\'seye','mephisto\'sbrain','tokenofabsolution',
  'twistedessenceofsuffering','chargedessenceofhatred',
  'burningessenceofterror','festeringessenceofdestruction',
  'standardofheroes'
];
export const itemRegex = new RegExp(`^(${baseItems.join('|')})$`, 'i');
