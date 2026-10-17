# Writing a trip template

A template is one JSON file describing what you know about a kind of trip. You can write one by hand, or build it in the app: *Templates → Create a new template* (or start from an existing one), fill it in, then use *Settings → Export as template*.

## The pieces

- **anchors**: the key dates, such as `surgery` (a single day) or `trip` (a range with a start and end). A template can have several, like `surgery` plus `follow-up`; each person sets their own date for each one. Everything else is timed from them.
- **phases**: named stretches like *Pre-op* or *On the trail*, each with a `when`.
- **when**: either `{"phase": "pre-op"}` or `{"anchor": "surgery", "from": "-14d", "to": "-1d"}`. Offsets are hours, days or weeks: `-12h`, `-14d`, `+6w`, `0d`. Use `"trip:end"` for the end of a range anchor, and `toAnchor` when the window ends relative to a different anchor.
- **rules, meds, packing, food, contacts, logistics, daily**: the content of each view. See the field descriptions in `data/schema/template.schema.json`.
- **why**: `{"text": "…", "basis": "official|evidence|experience", "sources": ["source-id"]}`. Add one whenever the reason isn't obvious. Sources are listed once under `sources` and cited by id.
- **asOf**: the date you wrote it. Professionals change their guidance; this tells readers how old the advice is.

Contacts can name a real surgeon, ranger station or venue, or stay as a role only. Never put anything personal in a template: doses, your own dates, or anything that could identify a patient.

## Checking it

```sh
npx --yes -p ajv-cli@5 -p ajv-formats@3 ajv validate --spec=draft2020 --all-errors -c ajv-formats -s data/schema/template.schema.json -d path/to/template.json
node scripts/check-data.js path/to/template.json
```

The second command checks what the schema can't: ids are unique and every phase, anchor, source, med and contact reference exists.

## Sharing it

- **Privately:** send the file. The other person uses *Import a template file*. This is the right way for anything sensitive or proprietary.
- **Publicly, as a built-in:** add the file as `data/templates/<id>.json`, add its id to `data/templates.json`, and open a pull request. The *Check data* workflow runs both checks.

Ids are stored in people's plans, so never rename or reuse a template id or an item id once it has shipped.
