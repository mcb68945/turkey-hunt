// ===== EDIT THESE =====
// Player names, in a fixed order. Changing names or order changes everyone's words,
// so finalize this BEFORE printing the QR codes.
const NAMES = ["Jordan", "Jonas", "Noelle", "Nolan", "Isla", "Chris", "Scarlet", "Amelia", "Zane", "Silas", "Baby Sal"];

// Secret key. Change it to anything; it scrambles all the words and tag links.
// Changing it after printing breaks the printed codes.
const SECRET = "gobble-gobble-2026";

// Players who get short, easy words (3-4 letters).
const SHORT_WORD_KIDS = ["Jonas", "Isla"];

// Number of hidden tags.
const TAG_COUNT = 25;

// PIN an adult types to switch which kid a device belongs to.
const HOST_PIN = "1126";
// ======================

const WORDS_RAW = `apple acorn anchor arrow badge bagel banjo beach beans bear bell berry bison blimp boat bongo
boots brick bubble bucket bunny cabin cactus cake camel candy canoe cape carrot castle cello chalk cheese
cherry chess chick chili cider circus clam cloud clown coach cobra cocoa comet cookie coral corn cowboy crab
crane crayon cricket crown cupcake daisy dino disco dolphin donut dragon drum duck eagle earth echo egg elbow
elf elk ember fairy falcon fern fiddle fig finch fish flag flute fox frog fudge gecko genie ghost giant ginger
giraffe glove goat goose grape gravy guitar gumbo hammer harp hawk hippo honey horse igloo jam jazz jelly jet
juice kazoo kettle kite kiwi koala ladder lemon lime lion llama lobster magic mango maple marble melon meteor
mitten monkey moose muffin nacho narwhal nest noodle ocean olive orbit otter owl panda pancake parrot pasta
peach peanut pear pebble pecan penguin pepper piano pickle pie pigeon pilot pirate pizza planet plum pony
popcorn potato pretzel puffin pumpkin puppy quail quilt rabbit radar rainbow raven robot rocket rodeo rooster
ruby saddle salsa scarf seal shark sheep shell skunk sled sloth snail snake snow socks spoon squid star stew
sugar swan taco tiger toast tomato tuba tulip turkey turtle unicorn vanilla violin volcano waffle walrus wagon
whale wizard wolf yak yam yeti yogurt yoyo zebra zipper badger beetle biscuit bobcat butter button candle
cotton coyote feather flamingo gumdrop hamster hedgehog jaguar ketchup ladybug lantern lizard meadow mouse
mustard nugget oatmeal octopus onion oyster pajamas parsnip pelican pillow popsicle possum raisin reindeer
sandal sprinkle stuffing sundae teapot thunder tractor trumpet tugboat walnut weasel wombat zucchini acrobat
avocado bamboo banana basket blanket broccoli buffalo burrito noodles moon comet2`;

const SHORT_RAW = `cat dog pig cow hen bug bee fox ant bat yak emu ape cub pup sun moon star sky hat cap bus car van jet
boat ship cake bun corn pea bean nut toy ball kite drum bell box cup mug pot pan fan bed rug map pen red blue
pink gold tree leaf rose frog duck fish bear lion deer goat seal crab toad worm sock shoe fork ring snow rain`;

// ---------- word + token logic (shared by all pages) ----------
function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function wordPool(raw, salt, exclude) {
  const list = [...new Set(raw.split(/\s+/).map(w => w.trim().toUpperCase()).filter(w => /^[A-Z]+$/.test(w) && !exclude.has(w)))];
  const rand = mulberry32(hash32(SECRET + salt));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
}
const SHORT_WORDS = wordPool(SHORT_RAW, "|short", new Set());
const WORDS = wordPool(WORDS_RAW, "|words", new Set(SHORT_WORDS));
const SHORT_SET = new Set(SHORT_WORD_KIDS.map(n => NAMES.indexOf(n)).filter(i => i >= 0));
// Each kid's slot within its own pool.
const SLOT = (() => { let s = 0, l = 0; return NAMES.map((_, i) => SHORT_SET.has(i) ? s++ : l++); })();
if (SHORT_WORDS.length < SHORT_SET.size * TAG_COUNT || WORDS.length < (NAMES.length - SHORT_SET.size) * TAG_COUNT) {
  throw new Error("Not enough words for " + NAMES.length + " players");
}
// Each (kid, tag) pair gets its own word; no two pairs share a word.
function wordFor(kidIndex, tag) {
  const pool = SHORT_SET.has(kidIndex) ? SHORT_WORDS : WORDS;
  return pool[SLOT[kidIndex] * TAG_COUNT + (tag - 1)];
}
// Opaque per-tag link token so kids can't edit the URL to jump to another tag.
function tokenFor(tag) { return hash32(SECRET + "|tag|" + tag).toString(36).padStart(6, "0").slice(0, 6); }
function tagFromToken(tok) {
  for (let t = 1; t <= TAG_COUNT; t++) if (tokenFor(t) === tok) return t;
  return null;
}
// word -> {kid, tag}
function buildLookup() {
  const m = new Map();
  NAMES.forEach((_, k) => { for (let t = 1; t <= TAG_COUNT; t++) m.set(wordFor(k, t), { kid: k, tag: t }); });
  return m;
}
function store(key, val) {
  try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); return val; }
  catch (e) { return null; }
}
