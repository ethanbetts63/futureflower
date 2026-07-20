# FutureFlower Marketing Pipeline Spin-Up Prompt

You are coordinating the podcast outreach pipeline. Work through the phases below in strict order, one phase at a time — never start a phase until the previous phase has fully completed. Tell the agents to summarise only any issues they have with their task. No issues no summaries. After launching an agent, wait silently until completion.

Run all commands from `C:\Users\ethan\coding\futureflower`.

**Agents in this pipeline run one at a time, never concurrently.** Every phase writes to a single shared file (`country_review.json` in Phase 2, `podcasts.jsonl` in Phase 3). Two agents editing the same file will silently lose each other's work. Do not parallelise to save time.

**Do not read `country_instructions.md` or `ai_instructions.md`. Just pass the paths on.**

---

## Dev Mode

If the user said to use `--dev`, you are in dev mode. Dev mode affects:

- **Phase 4** — append `--dev` to the `upload` command so it targets the local server instead of production

If the user said nothing about `--dev`, do not mention it.

---

## Phase 1 — Scrape

Target: **50 entries** in `marketing/podcasts.jsonl`, unless the user named a different number.

Count the entries already in `marketing/podcasts.jsonl` and scrape only the shortfall:

```powershell
python manage.py scrape_pods --batch <shortfall>
```

The scraper searches the iTunes AU store, but that only selects the store catalog — roughly four in five results will still be foreign podcasts. Phase 2 is what actually enforces the Australian filter. Do not try to judge podcasts yourself here.

Re-run the command if it stops short of the target. Stop and report to the user if either of these appears:

- `5 consecutive terms returned nothing` — repeatedly, meaning the search is drying up
- `All 676 terms exhausted` — the alphabet sweep is finished and needs new search terms

Once `podcasts.jsonl` holds roughly the target number of entries, proceed to Phase 2.

---

## Phase 2 — Country Review

Read `marketing/podcasts.jsonl` and collect the `podcast_name` and `feed_url` of every entry.

Split them into batches of **15**. Then, one agent at a time:

- Give the agent its batch as an explicit list of `podcast_name` + `feed_url` pairs. Tell it this list is authoritative — it must review exactly these and nothing else, and must not read the rest of `podcasts.jsonl`.
- Give it the prompt at `C:\Users\ethan\coding\futureflower\marketing\country_instructions.md`.
- Tell it **not** to run `apply_country_review`. You run that once, after every batch is done.

Wait for each agent to finish before starting the next.

When all batches are complete, run:

```powershell
python manage.py apply_country_review
```

This drops the `not_aus` and `unsure` entries, leaving only Australian podcasts in the queue. If it warns that entries had no decision, an agent missed some — spin up one more agent for exactly those before continuing.

Report how many survived. Expect roughly one in five. If nothing survived, stop and tell the user rather than proceeding to Phase 3 with an empty queue.

---

## Phase 3 — Intro Writing

Only the Australian podcasts remain in `marketing/podcasts.jsonl` now.

Split them into batches of **10**. Then, one agent at a time:

- Give the agent the prompt at `C:\Users\ethan\coding\futureflower\marketing\ai_instructions.md`.
- Tell it **not** to run the scraper, and **not** to run `promote_outreach` or `upload` at the end. You handle those in Phase 4.
- Tell it to fill in `subject` and `custom_intro` only for its assigned batch.

Wait for each agent to finish before starting the next.

This phase writes the actual email copy, so quality matters more than speed here. If an agent reports it could not write a natural intro for an entry — usually a thin or missing episode description — leave that entry's fields blank. `promote_outreach` skips unfilled entries, so it will simply stay in the queue.

---

## Phase 4 — Promote and Upload

Once every entry has a `subject` and `custom_intro`, run:

```powershell
python manage.py promote_outreach
python manage.py upload
```

(Append `--dev` to the `upload` command if in dev mode.)

The first moves filled entries into `marketing/outbox/` as individual JSON files. The second pushes them to the server's `inbox/` and deletes the local copies as they succeed. Report the uploaded and failed counts.

---

## Phase 5 — Send

**Stop here. Do not send without the user's explicit go-ahead.**

This phase fires real cold emails from the dev Gmail account to real people. It cannot be undone. Report to the user how many entries are queued and waiting, and ask whether to send and how many.

Sending also runs **on the live server**, not locally — `send_outreach` reads from the server's `inbox/`, which is where Phase 4 just uploaded to. If you are not on the server, say so and hand off to the user rather than attempting it.

When the user has confirmed, and only then:

```powershell
python manage.py send_outreach --count <number the user gave>
```

Sent entries move to `contacted_podcasts.jsonl` automatically. The command waits 30 seconds between sends, so a large count takes a while — this is deliberate rate limiting, do not work around it.
