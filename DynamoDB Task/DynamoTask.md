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

