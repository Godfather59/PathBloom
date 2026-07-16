# PathBloom content packs

PathBloom story content is stored in JSON files under `src/content/packs/`. The game discovers these files automatically through Vite, validates them, and makes valid packs available to the simulation and the in-game **Content Studio**.

## Required pack fields

```json
{
  "schemaVersion": 1,
  "id": "unique-pack-id",
  "name": { "en": "English name", "ar": "الاسم العربي" },
  "description": { "en": "Description", "ar": "الوصف" },
  "category": "school",
  "countries": ["*"],
  "events": []
}
```

Pack IDs and event IDs may contain letters, numbers, hyphens, and underscores. Every event and choice must have both English and Arabic text.

## Event fields

```json
{
  "id": "school_example",
  "frequency": "year",
  "weight": 5,
  "cooldownMonths": 24,
  "hidden": false,
  "conditions": {
    "minAge": 8,
    "maxAge": 18,
    "requiresSchool": true
  },
  "text": {
    "en": "An event happened.",
    "ar": "وقع حدث."
  },
  "choices": []
}
```

- `frequency`: `year` or `month`.
- `weight`: relative selection weight among eligible events.
- `cooldownMonths`: minimum time before the same event can appear again.
- `hidden`: hidden events are only reached through a scheduled follow-up.

## Supported conditions

- `minAge`, `maxAge`
- `countries`, `excludedCountries`
- `gender`
- `requiresSchool`
- `requiresJob`, `requiresNoJob`
- `requiresCampaign`, `requiresPoliticalCareer`
- `requiresWar`
- `requiresInPrison`, `requiresNotInPrison`
- `requiresRelationshipType`
- `requiresFlag`, `excludesFlag`
- `minMoney`, `maxMoney`
- `minStress`, `maxStress`
- `minJobYears`
- `minProfessionalReputation`
- `minCriminalReputation`, `maxCriminalReputation`
- `minPoliticalReputation`
- `minFamilyReputation`
- `minPublicReputation`
- `minTrustReputation`
- `chance`

## Choice fields

```json
{
  "id": "accept",
  "text": { "en": "Accept", "ar": "اقبل" },
  "outcome": {
    "en": "You accepted the offer.",
    "ar": "قبلت العرض."
  },
  "effects": {
    "happiness": 4,
    "stress": 2,
    "money": -500
  },
  "reputation": {
    "professional": 3,
    "trust": 2
  },
  "setFlags": {
    "acceptedExample": true
  },
  "relationshipEffects": {
    "type": "Sibling",
    "stat": 8
  },
  "jobEffects": {
    "salaryMultiplier": 1.1,
    "performance": 5
  },
  "situationEffects": {
    "campaignPolling": 4
  },
  "next": {
    "eventId": "example_followup",
    "delayMonths": 6
  }
}
```

Negative event costs never force cash below zero. Any unpaid amount becomes personal debt.

## Follow-up chains

Create the follow-up as another event in the same pack and set `hidden: true`. Reference it from a choice through `next.eventId`. The validator rejects missing follow-up IDs.

## Validation

```powershell
npm run validate:content
npm run test:content
```

The validator checks:

- invalid or duplicate IDs
- missing English or Arabic text
- events without enough choices
- choices without IDs
- broken follow-up links
- malformed schema versions

## In-game editing

Open the pause menu and choose **Content Studio**. It can:

- browse built-in and custom packs
- enable or disable packs
- copy a built-in pack into the JSON editor
- validate JSON before saving
- import and export JSON files
- update or delete custom packs

Custom packs are stored locally on the device and are limited to 50 packs.
