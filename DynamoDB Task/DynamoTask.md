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

| Attribute | Type | Notes |
| --- | --- | --- |
| `name` | S | Display name |
| `email` | S | Unique email |
| `password_hash` | S | Task 1 only (web auth) |
| `role` | S | `EMPLOYEE` / `TEAM_LEAD` / `ADMIN` |
| `team` | S | Team name (nullable) |
| `discord_id` | S | Task 2 — Discord snowflake ID |
| `is_active` | BOOL | Default `true` |
| `created_at` | S | ISO-8601 timestamp |

**Email Lookup Item**

```
PK:  EMAIL#<email>
SK:  LOOKUP
```

| Attribute | Type | Notes |
| --- | --- | --- |
| `user_id` | S | Points to the `<id>` in `USER#<id>` |

**Discord Lookup Item** 

```
PK:  DISCORD#<discordId>
SK:  LOOKUP
```

| Attribute | Type | Notes |
| --- | --- | --- |
| `user_id` | S | Points to the `<id>` in `USER#<id>` |

---