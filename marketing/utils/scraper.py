import json
import re
import time
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

BASE_DIR   = Path(__file__).parent.parent
JSONL_PATH = BASE_DIR / "podcasts.jsonl"

ITUNES_NS  = "http://www.itunes.com/dtds/podcast-1.0.dtd"
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"


# ---------------------------------------------------------------------------
# Tracking
# ---------------------------------------------------------------------------

def _load_list(filename):
    path = BASE_DIR / filename
    var = "SEARCHED_TERMS" if "terms" in filename else "SEARCHED_FEEDS"
    scope = {}
    exec(path.read_text(encoding="utf-8"), scope)
    return list(scope.get(var, []))


def _save_list(filename, data):
    path = BASE_DIR / filename
    var = "SEARCHED_TERMS" if "terms" in filename else "SEARCHED_FEEDS"
    path.write_text(f"{var} = {json.dumps(data, indent=2)}\n", encoding="utf-8")


def load_searched_terms():
    return _load_list("searched_terms.py")


def save_searched_terms(terms):
    _save_list("searched_terms.py", terms)


def load_searched_feeds():
    return set(_load_list("searched_feeds.py"))


def save_searched_feeds(feeds):
    _save_list("searched_feeds.py", sorted(feeds))


# ---------------------------------------------------------------------------
# Term generation
# ---------------------------------------------------------------------------

def all_terms():
    for a in "abcdefghijklmnopqrstuvwxyz":
        for b in "abcdefghijklmnopqrstuvwxyz":
            yield a + b


def next_terms(searched, count):
    results = []
    for term in all_terms():
        if term not in searched:
            results.append(term)
            if len(results) == count:
                break
    return results


# ---------------------------------------------------------------------------
# iTunes search
# ---------------------------------------------------------------------------

def search_itunes(term):
    try:
        resp = requests.get(
            "https://itunes.apple.com/search",
            params={"media": "podcast", "term": term, "limit": 200},
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json().get("results", [])
    except Exception:
        return []


# ---------------------------------------------------------------------------
# iTunes-level filters
# ---------------------------------------------------------------------------

def is_recent(date_str, days=30):
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return (datetime.now(timezone.utc) - dt) <= timedelta(days=days)
    except Exception:
        return False


def passes_itunes_filters(result):
    return (
        result.get("trackCount", 0) >= 50
        and is_recent(result.get("releaseDate", ""))
        and bool(result.get("feedUrl"))
    )


# ---------------------------------------------------------------------------
# RSS parsing
# ---------------------------------------------------------------------------

def _text(el, tag, ns):
    return (el.findtext(tag, namespaces=ns) or "").strip()


def _strip_html(text):
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_rss(feed_url):
    try:
        resp = requests.get(feed_url, timeout=15)
        resp.raise_for_status()
    except Exception:
        return None

    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError:
        return None

    channel = root.find("channel")
    if channel is None:
        return None

    ns = {"itunes": ITUNES_NS, "content": CONTENT_NS}

    language = _text(channel, "language", ns).lower()
    if language and not language.startswith("en"):
        return None

    host_name = (
        _text(channel, "itunes:owner/itunes:name", ns)
        or _text(channel, "itunes:author", ns)
        or _text(channel, "author", ns)
    )
    email   = _text(channel, "itunes:owner/itunes:email", ns)
    website = _text(channel, "link", ns)

    first_item = channel.find("item")
    if first_item is None:
        return None

    episode_title = _text(first_item, "title", ns)
    episode_desc  = (
        _text(first_item, "content:encoded", ns)
        or _text(first_item, "description", ns)
        or _text(first_item, "itunes:summary", ns)
    )
    episode_desc = _strip_html(episode_desc)[:1500]

    return {
        "host_name":                  host_name,
        "email":                      email,
        "website":                    website,
        "latest_episode_title":       episode_title,
        "latest_episode_description": episode_desc,
    }


def has_required_fields(rss):
    return all([
        rss.get("host_name"),
        rss.get("email"),
        rss.get("website"),
        rss.get("latest_episode_title"),
        rss.get("latest_episode_description"),
    ])


# ---------------------------------------------------------------------------
# Core scrape
# ---------------------------------------------------------------------------

def scrape_term(term, searched_feeds, stdout_write, limit=None):
    """
    Scrape one iTunes search term.
    limit: stop writing once this many entries have been written (None = unlimited).
    Returns (written, skipped, searched_feeds, limit_reached).
    """
    stdout_write(f"[{term}] Searching iTunes...")
    results = search_itunes(term)
    stdout_write(f"  {len(results)} results returned")

    written = 0
    skipped = 0

    for result in results:
        if limit is not None and written >= limit:
            break

        feed_url = result.get("feedUrl", "").strip()

        if feed_url in searched_feeds:
            skipped += 1
            continue

        if not passes_itunes_filters(result):
            if feed_url:
                searched_feeds.add(feed_url)
            skipped += 1
            continue

        searched_feeds.add(feed_url)

        time.sleep(0.4)
        rss = parse_rss(feed_url)

        if rss is None or not has_required_fields(rss):
            skipped += 1
            continue

        entry = {
            "subject":                    "",
            "custom_intro":               "",
            "email":                      rss["email"],
            "podcast_name":               result.get("collectionName", "").strip(),
            "host_name":                  rss["host_name"],
            "website":                    rss["website"],
            "episode_count":              result.get("trackCount", 0),
            "latest_episode_title":       rss["latest_episode_title"],
            "latest_episode_description": rss["latest_episode_description"],
            "feed_url":                   feed_url,
            "apple_url":                  result.get("collectionViewUrl", ""),
            "genre":                      result.get("primaryGenreName", ""),
            "last_release_date":          result.get("releaseDate", ""),
        }

        with open(JSONL_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

        written += 1
        stdout_write(f"  + {entry['podcast_name']}  <{entry['email']}>")

    stdout_write(f"  Written: {written}  |  Skipped: {skipped}")
    limit_reached = limit is not None and written >= limit
    return written, skipped, searched_feeds, limit_reached
