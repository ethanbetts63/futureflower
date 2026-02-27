# Marketing

Podcast outreach tool. Scrapes iTunes for podcast leads, stores them in a JSONL file, and sends personalised cold emails from the dev Gmail account.

## Flow

1. **Scrape** — run the scrape command to populate `podcasts.jsonl` with qualifying podcast leads
2. **Fill in the blanks** — open `podcasts.jsonl` and bring a batch to Claude. Claude writes the `subject` and `custom_intro` for each entry based on the podcast and latest episode
3. **Send** — run the send command to fire off all emails. Sent entries are moved to `contacted_podcasts.jsonl` automatically

## Commands

```bash
# Scrape the next N qualifying podcasts into podcasts.jsonl
python manage.py scrape_podcasts --batch 20

# Send a one-off test email
python manage.py send_email --to you@example.com --subject "Test" --body "Hello."

# Send outreach emails to every entry in podcasts.jsonl
python manage.py send_outreach
```

## Key Files

- `marketing/podcasts.jsonl` — leads to be contacted (gitignored)
- `marketing/contacted_podcasts.jsonl` — sent entries, moved here after successful send (gitignored)
- `marketing/email.txt` — the outreach email template. The `__________________________________________` placeholder is replaced with each entry's `custom_intro`
- `marketing/searched_terms.py` — iTunes search terms already queried (aa → zz), prevents re-searching
- `marketing/searched_feeds.py` — RSS feed URLs already attempted, prevents duplicate fetches across terms
- `marketing/utils/scraper.py` — scraping logic
- `marketing/utils/emailer.py` — Gmail SMTP sender

## JSONL Entry Format

| Field | Description |
|-------|-------------|
| `subject` | Email subject line — filled in by Claude |
| `custom_intro` | Personalised opening line referencing a specific episode — filled in by Claude |
| `email` | Contact email pulled from the podcast RSS feed |
| `podcast_name` | Podcast title |
| `host_name` | Host name from RSS |
| `website` | Podcast website |
| `episode_count` | Total episodes published |
| `latest_episode_title` | Title of the most recent episode |
| `latest_episode_description` | Description of the most recent episode |
| `feed_url` | RSS feed URL |
| `apple_url` | Apple Podcasts URL |
| `genre` | Primary genre from iTunes |
| `last_release_date` | Date of most recent episode |

## Scrape Filters

Podcasts are only kept if they pass all of the following:
- At least 50 episodes published
- Released an episode within the last 30 days
- Language is English
- RSS feed contains: email, host name, website, latest episode title and description
