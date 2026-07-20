# Podcast Country Review Prompt

You are reviewing scraped podcast leads and deciding which ones are Australian.

Read:

```text
C:\Users\ethan\coding\futureflower\marketing\podcasts.jsonl
```

Update:

```text
C:\Users\ethan\coding\futureflower\marketing\country_review.json
```

---

## Task

For each entry in `podcasts.jsonl`, decide whether the podcast is:

- `aus`: the host or producer is based in Australia
- `not_aus`: the host or producer is based somewhere else
- `unsure`: you cannot confidently decide

The test is where the **people making the show** are based, not what the show
is about. A US-hosted travel show that covers Australia is `not_aus`. A
Melbourne-based show about American football is `aus`.

---

## How to decide

Start with the data already in the entry. Each one gives you `podcast_name`,
`host_name`, `website`, `latest_episode_title` and
`latest_episode_description`. Often that is enough on its own:

- A `.au` domain in `website` or `email` is a strong signal for `aus`
- A non-English-speaking country's domain (`.se`, `.de`, `.nl`) is a strong
  signal for `not_aus`
- Descriptions that name Australian places, teams, or institutions
  (Sydney, Melbourne, AFL, NRL, ABC, Centrelink) point to `aus`
- A well-known national broadcaster or network in the host name usually
  settles it either way

Only search the web when the entry itself is inconclusive. Search the podcast
name plus a location word:

```text
"The Aussie Baseball Podcast" podcast host
"Meet Sandvik" podcast where based
"Saigon Signal" podcast host location
```

Use the podcast's own site, its Apple or Spotify listing, or the host's
public profiles. Do not guess. If searching does not make it clear, use
`unsure`.

---

## Output Format

`country_review.json` must stay valid JSON with this shape:

```json
{
  "aus": [
    {
      "feed_url": "https://anchor.fm/s/112793e58/podcast/rss",
      "podcast_name": "The Aussie Baseball Podcast"
    }
  ],
  "not_aus": [
    {
      "feed_url": "https://anchor.fm/s/dcc4f7c/podcast/rss",
      "podcast_name": "Meet Sandvik"
    }
  ],
  "unsure": []
}
```

Rules:

- Use `feed_url` exactly as it appears in `podcasts.jsonl`. It is the key that
  matches decisions back to entries.
- `podcast_name` is there so the file is readable. It is not used for matching.
- Put each podcast in exactly one of the three lists.
- Preserve existing decisions unless you have a clear reason to correct one.
- Do not add podcasts that are not in `podcasts.jsonl`.

---

## To finish

When you are done run:

```powershell
python manage.py apply_country_review
```

This drops the `not_aus` and `unsure` entries from `podcasts.jsonl`, leaving
only Australian podcasts in the queue. Those rejected feeds are already
recorded in `searched_feeds.py`, so they will never be scraped again.

Once that has run, move on to `ai_instructions.md` to write the subject lines
and intros for the remaining entries.
