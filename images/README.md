# Image manifest — Hotel Meghauli Safari

Every photograph the site expects, with the exact filename it looks for, what
the shot should show, and the aspect ratio it is cropped to. Drop the real
files into this folder using these exact names and the site fills itself — no
HTML needs editing.

Until a file exists, its slot renders as a calm sand-coloured block at the
correct size. Nothing shifts when the real photo lands.

## Rules for whoever shoots these

- **Only real photographs of this hotel and this area.** No stock imagery. The
  whole pitch is that the place is genuinely good value, and a stock photo of
  someone else's lodge undoes that the moment a guest arrives.
- **Landscape, shot in daylight, held level.** Phone cameras are fine.
- **JPEG, sRGB.** Target 1600px on the long edge and under 300 KB per file —
  most guests are on a mobile connection in Nepal.
- Crop to the ratio given below, or shoot loose and crop later; the site crops
  to fill, so anything important should sit away from the edges.
- `brand.imagery_avoid` is empty in the data — no subjects have been ruled out.

---

## Hero

| Filename | What it shows | Ratio |
|---|---|---|
| `hero-lodge-evening.jpg` | The garden and veranda in evening light, with the treeline behind. The single most important shot on the site — it is the first thing every visitor sees. Wide, calm, no people posing. | 16:9 |

## Rooms

| Filename | What it shows | Ratio |
|---|---|---|
| `room-deluxe-01.jpg` | Deluxe room: double bed made up, bedside lamps, window onto the garden. Show the space, not a corner of it. | 4:3 |
| `room-standard-ac-01.jpg` | Standard AC room: two single beds and the wall-mounted AC unit visible — guests paying for AC want to see it. | 4:3 |
| `room-non-ac-01.jpg` | Non-AC room: double bed with the ceiling fan in frame. Make it look clean and honest rather than apologetic — it is the same bathroom and the same breakfast. | 4:3 |
| `bathroom.jpg` | A private bathroom with the shower and hot water tap. 24-hour hot water is a selling point; show the tap. | 4:3 |

## The property

| Filename | What it shows | Ratio |
|---|---|---|
| `exterior-front.jpg` | The front of the hotel from the road, signboard readable. This is how an arriving guest recognises the place. | 4:3 |
| `reception.jpg` | The reception desk. Reception is staffed 24 hours, so a person behind it is good. | 4:3 |
| `garden-seating.jpg` | Garden seating in the grounds with trees behind. Carries the "calm and peaceful" half of the brief. | 4:3 |
| `dining-breakfast.jpg` | Breakfast laid out on a table. Breakfast is included in every rate — show what is actually served. | 4:3 |

## Activities

| Filename | What it shows | Ratio |
|---|---|---|
| `activity-jungle-safari.jpg` | A jeep on a forest track inside Chitwan National Park, early light. | 3:2 |
| `activity-community-forest.jpg` | A walking trail through the community forest, tall grass on both sides. | 3:2 |
| `activity-boat-ride.jpg` | A wooden canoe on calm water, forest along the far bank. | 3:2 |

## Around Meghauli

| Filename | What it shows | Ratio |
|---|---|---|
| `nearby-chitwan-park.jpg` | Grassland and forest inside the park, hills in the distance. | 3:2 |
| `nearby-riverside.jpg` | The Rapti or Narayani riverside at dusk, a canoe drawn up on the bank. | 3:2 |
| `nearby-birdlife.jpg` | A wading bird at the water's edge. Birdlife is specifically what the boat ride is sold on. | 3:2 |

## Social sharing

| Filename | What it shows | Ratio |
|---|---|---|
| `og-cover.jpg` | The card image shown when a link is shared on WhatsApp, Facebook or Messenger — where most of this hotel's traffic will come from. Use the strongest exterior or garden shot. Must be **1200 × 630 px exactly**; anything else gets cropped unpredictably by the platforms. Keep the hotel name clear of the edges. | 1200×630 |

## Logo

| Filename | What it shows | Ratio |
|---|---|---|
| `logo.png` | **Not yet referenced by any page.** `brand.logo_status` is `image_file` — a photo or scan of the signboard exists, but no clean version. Until one is supplied, the site sets the hotel name in type instead. See BUILD_NOTES.md. Supply as PNG with a transparent background, at least 400px wide, or an SVG. | — |

---

## Where each image appears

| Filename | Pages |
|---|---|
| `hero-lodge-evening.jpg` | index |
| `room-deluxe-01.jpg` | index, rooms, gallery |
| `room-standard-ac-01.jpg` | index, rooms, gallery |
| `room-non-ac-01.jpg` | index, rooms, gallery |
| `bathroom.jpg` | gallery |
| `exterior-front.jpg` | gallery |
| `reception.jpg` | gallery |
| `garden-seating.jpg` | gallery |
| `dining-breakfast.jpg` | gallery |
| `activity-jungle-safari.jpg` | index, experiences, gallery |
| `activity-community-forest.jpg` | index, experiences, gallery |
| `activity-boat-ride.jpg` | index, experiences, gallery |
| `nearby-chitwan-park.jpg` | location, gallery |
| `nearby-riverside.jpg` | location, gallery |
| `nearby-birdlife.jpg` | gallery |
| `og-cover.jpg` | social preview on every page |

16 photographs in total, plus the logo.
