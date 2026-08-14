# Hotel Site Pipeline — reusable

Turn one Google Form response into a deployable hotel website. Reusable across
hotels: the schema and the build prompt never change, only the per-hotel JSON.

## Files

- `hotel.schema.json` — the data contract. One source of truth for the shape.
- `<hotel>.json` — one per hotel (e.g. `meghauli-safari.json`), valid against
  the schema. This is where all facts and all discretionary calls live.
- `BUILD_PROMPT.md` — the Claude Code prompt. Same for every hotel.

## Flow for a new hotel

1. Collect the form response (CSV).
2. Produce `<hotel>.json` from it — map answers into schema fields, parse the
   free-text room/activity lines, and log every judgement call in
   `_assumptions` and every genuine unknown in `_todos`.
3. Fill `location`, `reviews`, and `geo` yourself from Google/TripAdvisor —
   these are researched, not asked.
4. Open the repo in Claude Code with `hotel.schema.json`, `<hotel>.json`, and
   `BUILD_PROMPT.md`. Run the prompt.
5. Search the output for `[TODO]`, resolve or delete each.
6. Deploy `appscript.gs`, paste its URL over `__ENDPOINT_URL__`, add a
   Turnstile key over `__TURNSTILE_KEY__`.
7. Test a booking end to end: confirm the owner email arrives and its wa.me
   reply link opens WhatsApp with the draft filled in.
8. Drop in real photos per `images/README.md`. Lock the responses Sheet to the
   owner's account only.

## Design principles baked into the format

- **Facts vs assumptions vs unknowns are separate.** `_assumptions` is the
  audit trail of every default chosen; `_todos` are things not safe to guess and
  rendered as visible markers. Nothing is invented silently.
- **`raw` fields never discard the owner's words.** Original (often Nepali) text
  is preserved beside the parsed version, so a bad parse is recoverable.
- **`booking.level` is the one architecture switch.** This pack implements
  `booking_request`. Moving a hotel to live availability or online payment is a
  deliberate level change, not an accident of copy.
- **Enums mirror the form**, so mapping responses in is mechanical.

## This hotel (Hotel Meghauli Safari)

Booking model: request + WhatsApp, no live availability, no online payment
(the owner's "pay online" tick conflicted with "requests are fine" — see
`_assumptions`). Key open items in `_todos`: exact tax rates, whether the
national-park safari price includes permit and guide, room/AC breakdown,
reviews, and registering a domain. The two phone numbers were recovered from
the original Nepali row after the translated CSV corrupted them to #ERROR!.
