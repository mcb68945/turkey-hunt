# Turkey Hunt

QR scavenger hunt: first to find all 25 tags wins, or whoever has the most when the clock runs out (ties go to whoever got there first). Every kid gets their own secret word at each tag.

- `index.html` — the page every QR code opens. Shows the scanning kid's word.
- `tv.html` — the terminal + scoreboard. Open it on the computer plugged into the TV (full screen: F11).
- `print.html` — printable sign-in code, 25 tag codes, and a hiding-spot checklist.
- `config.js` — player names, secret key, host PIN.

## Party flow
0. Host types `START` (default 25 min, set in `config.js`) or `START 20` at the TV to begin. Words typed before that are rejected. START also shows a 3-digit GO code; each kid types it on their phone once, and their words only appear after that (words change every game, so scanning early is useless). After a RESET + START, kids tap "New game code" on their phone.
1. Each kid scans the big sign-in code and taps their name (once per device).
2. Kids hunt. Scan a tag, get a word, run to the TV, type it, press Enter.
3. Terminal commands: `HELP`, `RESET` (then the host PIN) to wipe scores.

## Rules to tell the kids
- Only scan with your own phone/tablet: finds go to whoever owns the device.
- Leave the codes where they are.

Host PIN (to switch a device's player or reset the TV): set in `config.js`, default `1126`.
Finalize `NAMES` and `SECRET` before printing; changing either breaks the printed codes.
