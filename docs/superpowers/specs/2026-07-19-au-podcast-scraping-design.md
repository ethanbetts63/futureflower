# Restrict podcast scraping to Australia

> **Follow-up (2026-07-20):** the `country=AU` param turned out to be far
> weaker than assumed below. It selects the AU *store catalog*, not podcasts
> produced in Australia — a live run returned 4 foreign shows out of 5. The
> `"country": "AUS"` field in the API response echoes the queried store, not
> the show's origin, and RSS feeds carry no location field (both an Australian
> and a Swedish feed declared plain `en`). Geographic filtering is now handled
> by an agent review step; see `marketing/country_instructions.md`. The changes
> below still stand, they just aren't sufficient on their own.

## Context

The marketing podcast-outreach scraper (`marketing/`) currently searches the
default iTunes US store with no geographic filtering. We're narrowing scope
to Australian podcasts only, and separately widening the episode-count cap
to intentionally include smaller/newer shows.

## Changes

### 1. `marketing/utils/scraper.py` — `search_itunes()`

Add `"country": "AU"` to the iTunes Search API request params, so results
come from the AU store instead of the default US store. This is the only
geographic signal used — no RSS `<language>` or website-domain check on top
of it (country-store-only, per decision).

### 2. `marketing/utils/scraper.py` — `passes_itunes_filters()`

Change the episode-count filter from `trackCount <= 50` to
`trackCount <= 100`. Recency (≤30 days) and feed-URL-present checks are
unchanged.

### 3. `marketing/searched_terms.py`

Reset to `SEARCHED_TERMS = []`. The AU-store search is a different result
space than the US-store search that produced the existing 187/676 progress,
so all 676 two-letter terms need to be re-searched against AU.

### 4. `marketing/searched_feeds.py` and `marketing/planned_emails.py`

Left untouched. These are dedup lists keyed on feed URL / email address —
podcasts already scraped or already contacted should stay excluded even if
they resurface under the AU search, regardless of which store found them
originally.

## Out of scope

- No changes to `scrape_term()`, the `scrape_pods` management command, or
  the promote/upload/send pipeline — the AU restriction is fully contained
  in the two `scraper.py` functions plus the one data-file reset.
- No toggle between US/AU scraping — this is a one-way scope change per the
  request to reduce scope to just Australian podcasts.

## Testing

Manual: run `python manage.py scrape_pods --batch 5` after the change and
confirm entries written to `podcasts.jsonl` have `apple_url` containing
`/au/podcast/` and `episode_count <= 100`.
