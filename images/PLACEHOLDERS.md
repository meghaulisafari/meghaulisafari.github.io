# ⚠️ TEMPORARY PLACEHOLDER IMAGES — DELETE BEFORE LAUNCH

**None of the photographs currently in this folder are of Hotel Meghauli
Safari.** They were pulled from Wikimedia Commons purely so the layout could be
reviewed before the owner's real photographs arrive.

## Why they cannot ship

1. **They misrepresent the hotel.** A guest who books on the strength of a
   luxury reception desk in Laos and arrives in Meghauli has been misled. For a
   property whose entire pitch is honest value, that is the worst possible first
   impression — and the kind of thing that produces one-star reviews.
2. **The site says so in writing.** `gallery.html` normally states that every
   photograph is of the hotel or the area around Meghauli. That sentence has
   been temporarily replaced with a visible warning while these files are in
   place; it must be restored when the real photos land.
3. **Attribution is required.** Most of these are CC BY or CC BY-SA, which
   legally require credit and, for BY-SA, share-alike terms. The site carries no
   such credits, because it was never intended to publish these.

## Removing them

```bash
cd images
rm -f *.jpg .placeholder-credits.tsv PLACEHOLDERS.md
```

Then drop the owner's real photographs in, using the filenames in
`images/README.md`, and restore the gallery wording (see `BUILD_NOTES.md`).

## What is actually usable

Four of these are genuinely of Chitwan and could be licensed properly if the
owner wants a stopgap while their own photography is arranged — they would need
visible attribution and, for BY-SA, the share-alike notice:

- `activity-boat-ride.jpg` — canoe on the Rapti, Chitwan
- `activity-jungle-safari.jpg` — jeep safari, Chitwan
- `nearby-chitwan-park.jpg` — one-horned rhinoceros
- `nearby-riverside.jpg` — sunrise on the Narayani

The rest are hotel interiors from Guangzhou, Paris, Laos and Essex. Those are
placeholders in the most literal sense and have no business on this site.

## Full credits

| File | Source | Licence | Author |
|---|---|---|---|
| `activity-boat-ride.jpg` | [Canoeing at Rapti River, Chitwan National Park](https://commons.wikimedia.org/wiki/File:Canoeing_at_Rapti_River_-_chitwan_national_park.jpg) | CC BY-SA 4.0 | Zenith Rauniyar |
| `activity-community-forest.jpg` | [USAID Conservation Enterprise Retrospective, Nepal](https://commons.wikimedia.org/wiki/File:USAID_Measuring_Impact_Conservation_Enterprise_Retrospective_(Nepal;_National_Trust_for_Nature_Conservation)_(40301463261).jpg) | Public domain | USAID Biodiversity & Forestry |
| `activity-jungle-safari.jpg` | [Jeep Safari Chitwan 2](https://commons.wikimedia.org/wiki/File:Jeep_Safari_Chitwan_2.jpg) | CC BY-SA 4.0 | Pratap Baniya |
| `bathroom.jpg` | [MUSTEL Hotel bathroom, Guangzhou](https://commons.wikimedia.org/wiki/File:GD_%E5%BB%A3%E6%9D%B1_Guangdong_%E5%BB%A3%E5%B7%9E_Guangzhou_Huangpu_MUSTEL_Hotel_Knowledge_City_%E6%B5%B4%E5%AE%A4_bathroom_shower_June_2025_R12S_03.jpg) | CC0 | MeiOLA 2290 WMENSZ |
| `dining-breakfast.jpg` | [Breakfast table, Paris Opera Cadet Hotel](https://commons.wikimedia.org/wiki/File:Breakfast_table_outside_-_Paris_Opera_Cadet_Hotel.jpg) | CC BY-SA 2.0 | Opera Cadet, Paris |
| `exterior-front.jpg` | [Misty path in hotel grounds](https://commons.wikimedia.org/wiki/File:The_misty_path_in_my_hotel_grounds_looks_magical!_(49696609397).jpg) | CC BY 2.0 | shankar s., Pune, India |
| `garden-seating.jpg` | [Easton Lodge Gardens outdoor café, Essex](https://commons.wikimedia.org/wiki/File:Easton_Lodge_Gardens,_Little_Easton,_Essex,_England_outdoor_caf%C3%A9_19.jpg) | CC BY-SA 4.0 | Acabashi |
| `hero-lodge-evening.jpg` | [River Safari in Chitwan National Park](https://commons.wikimedia.org/wiki/File:River_Safari_in_Chitwan_National_Park.jpg) | CC BY-SA 4.0 | Shlok Maharjan |
| `nearby-birdlife.jpg` | [White-rumped vulture, Chitwan National Park](https://commons.wikimedia.org/wiki/File:White-rumped_vulture_in_Chitwan_National_Park.jpg) | CC BY-SA 4.0 | Mildeep |
| `nearby-chitwan-park.jpg` | [One Horned Rhinoceros](https://commons.wikimedia.org/wiki/File:One_Horned_Rhinoceros-2025.jpg) | CC BY-SA 4.0 | Aabha Pokharel |
| `nearby-riverside.jpg` | [Sunrise at Narayani River, Nepal](https://commons.wikimedia.org/wiki/File:Sunrise_at_Narayani_River,_Nepal.jpg) | CC BY-SA 4.0 | Prakash Bhandari |
| `og-cover.jpg` | [Sunset over the river, Sauraha, Chitwan](https://commons.wikimedia.org/wiki/File:Sunset_over_the_River_-_Sauraha_(Chitwan_National_Park)_-_Nepal_-_02_(13907295071).jpg) | CC BY-SA 2.0 | Adam Jones, Kelowna, Canada |
| `reception.jpg` | [Reception, Amantaka Resort, Luang Prabang, Laos](https://commons.wikimedia.org/wiki/File:Reception_desks_of_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg) | CC BY-SA 4.0 | Basile Morin |
| `room-deluxe-01.jpg` | [Bed in hotel room 6](https://commons.wikimedia.org/wiki/File:Bed_in_hotel_room_6.jpg) | CC0 | Kurt Kaiser |
| `room-non-ac-01.jpg` | [Two single beds in a simple hotel room](https://commons.wikimedia.org/wiki/File:Two_single_beds_in_a_room_with_a_window_and_simple_decor_ready_for_guests_at_a_hotel.jpg) | CC BY 2.0 | Shixart1985 |
| `room-standard-ac-01.jpg` | [Deluxe Room, twin beds](https://commons.wikimedia.org/wiki/File:Deluxe_Room_-_Twin_beds.jpg) | CC BY-SA 3.0 | Holidayinnklg |

All files were resized to 1400px on the long edge and re-encoded at JPEG
quality 45 (`og-cover.jpg` cropped to 1200×630). Total folder weight: ~2.9 MB.
