# DynamoDB Single Table Design — Access Patterns & Schema

> Covers **Task 1** (Iterations 1, 2, 3) and **Task 2** (Iteration 1).
> All entities live in a single DynamoDB table: **`MHP_Table`** or **`trainee-2026-niloy-mhp-data`**.

## Criteria

- **1 GSI used** (overloaded) — `GSI1`
- GSI1 is a **sparse, overloaded index**: only items that need cross-partition queries project `GSI1PK` / `GSI1SK`.

---

## Key Conventions

| Prefix | Meaning |
| --- | --- |
| `USER#<id>` | User partition — `<id>` is a UUID (Task 1) or Discord ID (Task 2) |
| `EMAIL#<email>` | Email lookup partition |
| `DISCORD#<discordId>` | Discord ID lookup partition |
| `TEAM#<name>` | Team partition — `<name>` is the team name/slug |
| `DAY#<date>` | Day partition — `<date>` in `YYYY-MM-DD` |
| `DATE#<date>` | GSI1 date partition (overloaded) |
| `MEAL#` | Meal-related sort key prefix |
| `WORKLOC#` | Work location sort key prefix |
| `WFHPERIOD` | WFH period collection partition |
| `ANNOUNCEMENT#<id>` | Announcement partition |
| `AUDIT#<date>` | Audit log partition (date-bucketed) |
| `CONFIG` | Policy & configuration partition |
| `ANNC#<status>` | Announcements by status (GSI1 overload) |
| `ACTOR#<userId>` | Audit logs by actor (GSI1 overload) |
| `PROFILE`, `METADATA`, `MEALS`, `LOOKUP` | Fixed sort key tokens |

> **Dates** are always `YYYY-MM-DD`. **Timestamps** are ISO-8601 (`YYYY-MM-DDTHH:MM:SSZ`).

---

## Full Schema Overview

| Entity | PK | SK | GSI1PK | GSI1SK |
| --- | --- | --- | --- | --- |
| User Profile | `USER#<id>` | `PROFILE` | — | — |
| Email Lookup | `EMAIL#<email>` | `LOOKUP` | — | — |
| Discord Lookup | `DISCORD#<discordId>` | `LOOKUP` | — | — |
| Team Metadata | `TEAM#<name>` | `METADATA` | — | — |
| Team Member | `TEAM#<name>` | `MEMBER#<userId>` | — | — |
| Meal Participation | `USER#<id>` | `MEAL#<date>#<mealType>` | `DATE#<date>` | `MEAL#<id>#<mealType>` |
| Work Location | `USER#<id>` | `WORKLOC#<date>` | `DATE#<date>` | `WORKLOC#<id>` |
| Day Metadata | `DAY#<date>` | `METADATA` | — | — |
| Day Available Meals | `DAY#<date>` | `MEALS` | — | — |
| Event Meal | `DAY#<date>` | `EVENTMEAL#<mealType>` | — | — |
| WFH Period | `WFHPERIOD` | `<startDate>#<userId>` | — | — |
| Announcement | `ANNOUNCEMENT#<id>` | `METADATA` | `ANNC#<status>` | `<publishedAt>` |
| Audit Log Entry | `AUDIT#<date>` | `<timestamp>#<uuid>` | `ACTOR#<actorId>` | `<timestamp>` |
| Policy / Config | `CONFIG` | `<name>` | — | — |
| Sched. Meal Pref | `USER#<id>` | `SCHEDPREF#<date>#<mealType>` | — | — |

---

## Entity Details

### Users

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 1 | Get user profile | T1 + T2 | `PK = USER#<id>` + `SK = PROFILE` |
| 2 | Login by email | T1 | `PK = EMAIL#<email>` + `SK = LOOKUP` → then fetch `USER#<id>` |
| 3 | Bot auth by Discord ID | T2 | `PK = DISCORD#<discordId>` + `SK = LOOKUP` → then fetch `USER#<id>` |
| 4 | Create / update user | T1 + T2 | `PUT PK = USER#<id>` + `SK = PROFILE` |
| 5 | Get user's team | T2 | `PK = USER#<id>` + `SK = PROFILE` → read `team` attribute |

#### DB Schema

**User Profile Item**

```
PK:  USER#<id>
SK:  PROFILE
```
`PK = USER#<id>` / `SK = PROFILE` — Stores the full user profile: name, email, password_hash (Task 1 web auth), role (`EMPLOYEE` / `TEAM_LEAD` / `ADMIN`), team, discord_id, is_active, created_at.

`PK = EMAIL#<email>` / `SK = LOOKUP` — Thin pointer containing only `user_id`. Used for email-based login: read this item first, then `GetItem` on `USER#<user_id>`.

`PK = DISCORD#<discordId>` / `SK = LOOKUP` — Same pattern as email lookup but keyed on Discord snowflake ID. Used by the bot for authentication.

> Both lookup items are maintained transactionally whenever email or discord_id changes on a user profile.

---

### Meal Participation

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 6 | Get user's all meals for a date | T1 + T2 | `PK = USER#<id>` + `SK begins_with MEAL#<date>` |
| 7 | Get user's specific meal | T1 + T2 | `PK = USER#<id>` + `SK = MEAL#<date>#<mealType>` |
| 8 | Opt in/out of a meal | T1 + T2 | `PUT PK = USER#<id>` + `SK = MEAL#<date>#<mealType>` |
| 9 | All participation for a date (headcount) | T1 + T2 | `GSI1PK = DATE#<date>` + `GSI1SK begins_with MEAL#` |
| 10 | Headcount by team for a date | T1 | Query #9 → filter on `team` attribute |

#### DB Schema

`PK = USER#<id>` / `SK = MEAL#<date>#<mealType>` — One item per user per meal per day. Stores is_participating (bool), team (denormalized at write time for filtering), updated_by, updated_at, reason.

`GSI1PK = DATE#<date>` / `GSI1SK = MEAL#<id>#<mealType>` — Projects into GSI1 so headcount queries can fetch all participation for a given date in one query. Filter by `team` attribute for team-specific headcounts.

> `mealType` values: `LUNCH`, `SNACKS`, `IFTAR`, `EVENT_DINNER`, `OPTIONAL_DINNER`.

---

### Work Location

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 11 | Get user's location for a date | T1 + T2 | `PK = USER#<id>` + `SK = WORKLOC#<date>` |
| 12 | Set user's location | T1 + T2 | `PUT PK = USER#<id>` + `SK = WORKLOC#<date>` |
| 13 | All locations for a date | T1 + T2 | `GSI1PK = DATE#<date>` + `GSI1SK begins_with WORKLOC#` |
| 14 | Monthly WFH count for a user | T1 + T2 | `PK = USER#<id>` + `SK begins_with WORKLOC#<YYYY-MM>` → filter `location = WFH` |

#### DB Schema

`PK = USER#<id>` / `SK = WORKLOC#<date>` — One item per user per day. Stores location (`OFFICE` or `WFH`), team (denormalized), updated_by, updated_at. If no item exists, app defaults to `OFFICE`.

`GSI1PK = DATE#<date>` / `GSI1SK = WORKLOC#<id>` — Projects into GSI1 for admin views of all locations on a date.

> Monthly WFH cap (≤ 5): query `SK begins_with WORKLOC#YYYY-MM` under the user's partition, count items where `location = WFH`.

---

### Day & Meals

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 15 | Get full day context | T1 + T2 | `PK = DAY#<date>` (returns all items in partition) |
| 16 | Get day type only | T1 + T2 | `PK = DAY#<date>` + `SK = METADATA` |
| 17 | Get available meals | T1 + T2 | `PK = DAY#<date>` + `SK = MEALS` |
| 18 | Set day type (special day) | T1 + T2 | `PUT PK = DAY#<date>` + `SK = METADATA` |
| 19 | Set available meals | T1 | `PUT PK = DAY#<date>` + `SK = MEALS` |
| 20 | Create / delete event meal | T1 | `PUT/DELETE PK = DAY#<date>` + `SK = EVENTMEAL#<mealType>` |

#### DB Schema

All day-level data shares the `DAY#<date>` partition — one query returns everything for that day:

- **`SK = METADATA`** — Day type info: day_type (`NORMAL`, `OFFICE_CLOSED`, `GOVERNMENT_HOLIDAY`, `SPECIAL_EVENT`, `GLOBAL_WFH`), note, created_by, created_at.
- **`SK = MEALS`** — Which meals are enabled: enabled_meals map (e.g. `{"lunch": true, "snacks": true, "iftar": false}`).
- **`SK = EVENTMEAL#<mealType>`** — One item per event meal: note, created_by, created_at.

> Special day types that block participation (`OFFICE_CLOSED`, `GOVERNMENT_HOLIDAY`, `GLOBAL_WFH`) are enforced in application logic (atlease is supposed to but have a lingering thought of not doing that and keep it as a soft constraint; for special cases).

---

### WFH Periods

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 21 | List all WFH periods | T1 | `PK = WFHPERIOD` (sorted by SK) |
| 22 | Check overlap / date lookup | T1 | `PK = WFHPERIOD` + `SK begins_with <date_prefix>` → filter in app |
| 23 | Create WFH period | T1 | `PUT PK = WFHPERIOD` + `SK = <startDate>#<userId>` |
| 24 | Delete WFH period | T1 | `DELETE PK = WFHPERIOD` + `SK = <startDate>#<userId>` |

#### DB Schema

`PK = WFHPERIOD` / `SK = <startDate>#<userId>` — All periods in one partition, naturally sorted by start date. Stores employee_id, end_date, reason, created_by, created_at.

> On create, the app also writes `WORKLOC#<date>` items (location = `WFH`) for every day in `[start_date, end_date]` under that user's partition.

---

### Announcements

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 25 | Get announcement by ID | T1 | `PK = ANNOUNCEMENTS` + `SK = <id>` |
| 26 | List all / filter by status | T1 | `PK = ANNOUNCEMENTS` → filter on `status` attribute |
| 27 | Create / update / delete | T1 | `PUT/DELETE PK = ANNOUNCEMENTS` + `SK = <id>` |

#### DB Schema

`PK = ANNOUNCEMENTS` / `SK = <id>` — All announcements in one partition (low volume). Stores title, body, audience (`all` or `team_leads`), status (`DRAFT` / `SCHEDULED` / `SENT`), scheduled_at, published_at, created_by, created_at. Filter by status or audience in app; no GSI needed.

---

### Audit Log

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 28 | Create audit entry | T1 | `PUT PK = AUDIT#<date>` + `SK = <timestamp>#<uuid>` |
| 29 | Query logs by date | T1 | `PK = AUDIT#<date>` + `SK` range |
| 30 | Filter by actor / entity / action | T1 | Query #29 → `FilterExpression` on `actor_id`, `entity_type`, `action` |

#### DB Schema

`PK = AUDIT#<date>` / `SK = <timestamp>#<uuid>` — Date-centric partition for efficient range queries. Each item stores actor_id, action (`create` / `update` / `delete`), entity_type, entity_id, target_user_id, field_changed, old_value, new_value, timestamp. Immutable — no updates or deletes. The `#<uuid>` suffix in SK guarantees uniqueness within the same timestamp.

---

### Policy / Config

#### Access Patterns

| # | Pattern | Source | Key Condition |
| --- | --- | --- | --- |
| 31 | Get a config value | T1 + T2 | `PK = CONFIG` + `SK = <name>` |
| 32 | Update a config value | T1 + T2 | `PUT PK = CONFIG` + `SK = <name>` |

#### DB Schema

`PK = CONFIG` / `SK = <name>` — One item per setting. Stores value (JSON or plain string), updated_by, updated_at.

Known keys: `cutoff_time` (meal update cutoff), `forward_planning_days`, `wfh_monthly_allowance`, `team_role_map` (Discord role → team mapping), `enabled_meals` (global meal toggles).

---

## GSI1 Summary

A single sparse GSI serves date-based cross-partition queries:

| Use Case | GSI1PK | GSI1SK |
| --- | --- | --- |
| All meals for a date | `DATE#<date>` | `MEAL#<userId>#<mealType>` |
| All locations for a date | `DATE#<date>` | `WORKLOC#<userId>` |

> Only Meal Participation and Work Location items write GSI1 keys. Everything else is excluded from the index.

---

## Access Pattern → Source Mapping

| Pattern # | Entity | Task 1 | Task 2 |
| --- | --- | --- | --- |
| 1–5 | User | ✓ | ✓ |
| 6–10 | Meal Participation | ✓ | ✓ |
| 11–14 | Work Location | ✓ | ✓ |
| 15–20 | Day & Meals | ✓ | ✓ |
| 21–24 | WFH Period | ✓ | — |
| 25–27 | Announcement | ✓ | — |
| 28–30 | Audit Log | ✓ | — |
| 31–32 | Policy / Config | ✓ | ✓ |