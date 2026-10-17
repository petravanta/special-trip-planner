# Special Trip Planner

Experienced participants in higher-stakes trips (a surgery or other medical stay, a multi-day hike, a camping festival, a conference) pass their hard-won knowledge to newcomers, so a first time is lower stakes and free of costly or frustrating mistakes.

## Try it

**[Open Special Trip Planner → petravanta.github.io/special-trip-planner](https://petravanta.github.io/special-trip-planner/)**

1. Pick a template, or **Import a template file** someone shared with you.
2. Set your key dates (surgery day, the days on trail, the festival week). Everything in the template lines up from them.
3. Open **Today** each day: the phase you are in, the rules in force and why, your checklist, food, and what is coming up.

## What it does

- **Templates vs. plans.** A template is what someone experienced knows about a kind of trip. Starting a plan copies it, so you can edit, add or hide anything without changing the original.
- **The why behind every rule.** Rules, meds and packing items carry a reason, marked as official (the professional or organizer in charge), evidence (a guideline or study) or experience, with sources. The app nudges you when a rule has no reason.
- **Views:** Today, Timeline & rules, Meds & health, Packing & shopping (with where and when to get each item), Food, Contacts & places, Logistics, Journal.
- **Private tracking.** Your dates, doses, checklist ticks, packing status, bookings, personal contacts and journal are private.
- **Share what you know, not who you are.** *Settings → Export as template* writes a template file from your plan with all private tracking left out, a choice per contact to keep its real details or only its role, and a full preview first.

Templates are a dated snapshot of shared experience. Wherever the surgeon, guide, organizer or other professional in charge says otherwise, follow them; the app says so next to the advice.

## Your data

Everything is stored in your browser (`localStorage`). **Export backup** under *Settings* downloads all of it as JSON, and **Import backup** merges one back in, following the *User data* section of the [shared standards](https://github.com/petravanta/general/blob/main/STANDARDS.md). Google Drive sync is not built yet.

Templates you import stay in your browser. Sensitive templates (a specific clinic's instructions, anything that could identify you) are meant to be shared as files outside this repo, never committed here.

## Extending the app

| Dataset | File | Schema | What it controls |
| --- | --- | --- | --- |
| Template index | `data/templates.json` | `data/schema/templates.schema.json` | Which built-in templates the app lists, in order |
| Templates | `data/templates/<id>.json` | `data/schema/template.schema.json` | One built-in trip template each |

[CONTRIBUTING.md](CONTRIBUTING.md) explains how to write a template, check it, and propose it.

## Running it

It is a single static file, `index.html`, with no build step. Serve the folder (`python3 -m http.server`) and open it; `data/` can't load from `file://`. GitHub Pages serves it from `main`, root folder.
