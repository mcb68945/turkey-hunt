# Turkey Hunt

QR scavenger hunt: first to find all 25 tags wins. Every kid gets their own secret word at each tag.

- `index.html` — the page every QR code opens. Shows the scanning kid's word.
- `tv.html` — the terminal + scoreboard. Open it on the computer plugged into the TV (full screen: F11).
- `print.html` — printable sign-in code, 25 tag codes, and a hiding-spot checklist.
- `config.js` — player names, secret key, host PIN.

## Party flow
1. Each kid scans the big sign-in code and taps their name (once per device).
2. Kids hunt. Scan a tag, get a word, run to the TV, type it, press Enter.
3. Terminal commands: `HELP`, `RESET` (then the host PIN) to wipe scores.

## Rules to tell the kids
- Only scan with your own phone/tablet: finds go to whoever owns the device.
- Leave the codes where they are.

Host PIN (to switch a device's player or reset the TV): set in `config.js`, default `1126`.
Finalize `NAMES` and `SECRET` before printing; changing either breaks the printed codes.
