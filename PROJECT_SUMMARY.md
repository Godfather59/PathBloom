# PathBloom: Life Simulator — Project Summary

> A comprehensive document describing the BitLife clone game project.

---

## 1. Overview

**Project name**: PathBloom: Life Simulator (originally LifePath: Ultimate Sim)  
**Repository**: `C:\Users\XPI\Desktop\BitLifeClone`  
**Version**: 1.1.0  
**App ID**: `com.pathbloom.lifesimulator`  

A text-based, choice-driven life simulation game heavily inspired by BitLife. The player starts as a newborn and ages year-by-year through life, making decisions about education, careers, relationships, crime, investments, hobbies, and more. The game tracks 8 core stats and presents randomized life events with branching choices.

---

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend Framework | React 19.2.0 |
| Build Tool | Vite 7.2.4 (with `@vitejs/plugin-react`) |
| Mobile Wrapper | Capacitor 8.0.0 (Android native) |
| Language | JavaScript (JSX) |
| CSS | Vanilla CSS with custom properties (theming) |
| Testing | Vitest 4.1.10 with jsdom 29.1.1 |
| Linting | ESLint 9.39.1 |
| Other Deps | Puppeteer, Sharp, Capacitor App plugin |

---

## 3. Project Structure

```
BitLifeClone/
├── .git/                          # Git repository
├── .gitignore
├── .idea/                         # IDE config
├── .vscode/                       # VSCode settings
├── android/                       # Capacitor Android native project
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradle.properties
│   ├── variables.gradle
│   ├── gradle/wrapper/
│   └── app/
│       ├── build.gradle
│       └── src/main/
│           ├── AndroidManifest.xml
│           ├── java/.../MainActivity.java
│           └── res/               # Icons, splash screens, themes
├── capacitor.config.json
├── dist/                          # Built web assets (Vite output)
│   ├── index.html
│   ├── manifest.json
│   ├── privacy-policy.html
│   └── icon-*.png
├── eslint.config.js
├── index.html                     # HTML entry (PWA-ready)
├── LifePath.apk                   # Pre-built APK
├── node_modules/
├── package.json
├── package-lock.json
├── public/
│   ├── vite.svg
│   ├── manifest.json
│   ├── icon-192.png / icon-512.png
│   └── privacy-policy.html
├── README.md
├── scripts/
│   ├── generate-icons.js
│   ├── generate-screenshots.mjs
│   ├── capture-screenshots.mjs
│   └── run-life-simulations.mjs
├── src/
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Root component (829 lines)
│   ├── App.css
│   ├── index.css                  # Global styles, CSS reset, animations
│   ├── index-backup.js
│   ├── assets/
│   ├── components/                # 71 UI components
│   └── logic/                     # 57 game logic modules
├── store-assets/                  # Google Play Store assets
│   ├── play-store-listing.md
│   ├── pathbloom-icon-512.png
│   ├── pathbloom-feature-graphic.png
│   ├── source/
│   └── screenshots/
└── vitest.config.js
```

---

## 4. Git History (4 Commits)

| Commit | Message | Description |
|---|---|---|
| `e5d1bfa` | `Initial release of LifePath: Ultimate Sim` | Full project skeleton: Capacitor Android, Vite/React, core logic files (Person, GameEngine, Events, Job), initial components, CSS theming. ~11,000 lines added. |
| `77faead` | `feat: Implement core game logic and UI components for a life simulation game.` | Refined RelationshipsMenu: personality-driven interactions, conflict system, promise system. |
| `a2b8371` | `feat: Implement the initial core game structure, UI components, state management, and multi-slot save/load system.` | Multi-slot save/load, expanded Activities/Assets/Job menus, richer events (574 lines), auto-save. ~1,442 lines added. |
| `80359f5` (HEAD) | `feat: Implement core game logic, UI components, and styling.` | Largest commit (~4,942 lines, 49 files). Dynasty Mode, Challenge Mode, Lifetime Stats, Family Tree, Will & Estate, Immigration, Business simulation, Celebrity system, Investments, Pets, Prison, Mafia, Military, Royalty, Social Media, Achievements (57), themes, stats charts, many new components. |

---

## 5. Core Architecture

### Entry Points

**`src/main.jsx`** — React bootstrap with Capacitor back-button handler (double-tap to exit).

**`src/App.jsx`** (829 lines) — Root component orchestrating all game state, modal routing, save/load/auto-save, achievement checking, and view transitions (Main Menu ↔ Gameplay ↔ Game Over). Uses React `useState` for all state; no external state management library.

### Key Modules

| File | Lines | Role |
|---|---|---|
| `src/logic/Person.js` | 2,812 | Central data model — all stats, relationships, assets, education, crime, mafia, royalty, social media, pets, will, business, immigration, fitness, aging, events, serialization, player actions |
| `src/logic/GameEngine.js` | 1,126 | Core game loop — `ageUp()` calls ~20 subsystems yearly: world simulation, career/finance/asset/education/pet processing, event generation, stat consequences, relationship mortality |
| `src/logic/Events.js` | 1,163+ | 200+ life event definitions with branching choices — childhood, teen, adult, elderly, career-specific, pandemic, seasonal, status-specific, rare events |
| `src/logic/Job.js` | 574 | 100+ job definitions across 20+ career paths with requirements, salary, stress, performance evaluation, promotions, firings, layoffs |

---

## 6. Implemented Features

### 6.1 Core Life Simulation
- Year-by-year aging from birth to death
- 8 stats: Happiness, Health, Smarts, Looks, Stress, Karma, Fame, Energy (all 0–100)
- Born traits: Genius, Athletic, Charismatic, Musical, Reckless, Resilient
- Skills: Voice, Instruments, Martial Arts, Cooking, Coding
- Natural stat decay (looks/health fade with age, childhood recovery)
- Death system with Game Over modal

### 6.2 Education
- Elementary School (ages 6–14)
- High School (ages 14–18)
- University (Bachelor's with majors)
- Graduate School (Medical, Law, Business, etc.)
- Scholarships, loans, study/dropout mechanics, performance tracking
- College sports (tryouts, practice, professional)
- Clubs system

### 6.3 Career System
- 100+ jobs across: Service/Food, Tech, Medical, Legal, Education, Military, Entertainment, Sports, Politics, Police/Fire, Business, Skilled Trades, Aviation, and more
- Career skill tree with nodes and skill points
- Job requirements (smarts, looks, health, education, specific degrees, custom skills)
- Income tax (progressive 10%–37%)
- Performance evaluations with raises, promotions, firing, layoffs
- Salary multipliers based on economy and career path

### 6.4 Relationship System (Advanced)
- Types: Father, Mother, Parent, King, Queen, Child, Sibling, Friend, Best Friend, Partner, Fiance, Spouse
- 8 personality profiles: Loyal, Affectionate, Ambitious, Independent, Sensitive, Playful, Practical, Adventurous
- Needs system (honesty, affection, encouragement, autonomy, reassurance, fun, stability, shared experiences)
- Memory system (up to 8 memories per relationship)
- Conflict system (tension → resentment, resolution actions)
- Promise system (make/keep/break promises)
- Financial arrangement system (joint/separate finances)
- Parenting decisions (support vs. boundaries)
- Dating, proposal (ring cost, acceptance chance), marriage (wedding budget, prenup), cheating, divorce

### 6.5 Assets & Economy
- Real Estate (appreciation/depreciation, mortgages, renting, tenant events)
- Vehicles (depreciation, condition, repairs)
- Investments: Stock market (index fund), Cryptocurrency (Dogecoin), individual stocks/crypto
- Mortgage system (down payment, monthly payments, interest rates, payoff)
- Asset market generated yearly with economy multipliers
- Business ownership (6 types: Restaurant, Tech Startup, Retail, Consulting, Real Estate Agency, Manufacturing)
- Living expenses (location-based cost index, housing multiplier, hardship multiplier)
- Personal debt with interest, bankruptcy
- Student loans with interest and repayment

### 6.6 World Simulation
- Economy cycles: Normal, Recession, Boom (probabilistic transitions)
- Conflict states: Peace/War
- Pandemic system (start/end probability, events: masks, lockdowns, infection, remote work)
- World events (natural disasters, tech advancements, cultural events)
- NPC simulation (jobs, marriages, education)
- World news feed

### 6.7 Interactive Events
- 200+ events across all life stages with branching choices:
  - **Childhood**: Lost tooth, ate glue, imaginary friend, stray dog, treehouse, bike scrapes, school play, chicken pox, ice cream truck
  - **Teen**: Vape offer, skip school, crush rejection, driving test, house party, prom, acne, sneaking out, shoplifting dare, first kiss
  - **Young adult**: Frat party, all-nighter, first apartment, backpacking Europe
  - **Adult**: Identity theft, alien abduction, jury duty, crypto scams, office romance, coworker pranks, layoff rumors
  - **Elderly**: Grandkids visit, memory slips, bingo night, retirement hobbies, health scares, memory loss
  - **Career-specific**: Political disasters, musical hits/flops, sports championships, military deployment, office politics
  - **Status-specific**: Royal duties, celebrity encounters, mafia hits
  - **Pandemic**: Mask confrontations, lockdowns, infection, remote work
  - **Rare**: Time travelers, found contraband, bank errors
- Stat changes, money changes, or multi-choice decisions

### 6.8 Special Systems
| System | Description |
|---|---|
| **Mafia** | Join families, rank up (Soldier → Caporegime → Godfather), crimes, standing |
| **Royalty** | Born prince/princess, reign as king/queen, duties, abdication, execution |
| **Politics** | Campaign for office, governance, cabinet, policies, diplomacy |
| **Military** | Enlist, deploy, rank progression, minesweeper minigame |
| **Social Media** | Multiple platforms (Instagram, TikTok, YouTube), followers, posts, monetization |
| **Celebrity** | Fame tracking, fan interactions, paparazzi |
| **Prison** | Sentence countdown, prison actions, early release |
| **Addiction** | Substances, rehab, withdrawal effects |
| **Fitness** | Weight tracking, exercise, diet, muscle mass, body fat |
| **Insurance** | Home, health, auto policies, claims |
| **Renovation** | Property upgrades, flipping |
| **Space Program** | Join space agency, training, missions, QTE minigame |
| **Philanthropy** | Charity donations, foundations, legacy projects |
| **Lawsuits** | File lawsuits, sue, legal outcomes |
| **Time Capsules** | Write and read time capsules |
| **Will & Estate** | Wills, beneficiaries, heirlooms |
| **Immigration** | Visa applications, citizenship, multiple citizenships |
| **Language Learning** | Random chance to learn languages each year (10 available) |
| **Patents/Nobel Prize** | Research career rewards |
| **Seasons** | Spring, Summer, Fall, Winter with seasonal events |
| **Travel** | Destinations, country visits |
| **GeoPolitics** | International relations events |

### 6.9 Meta Progression
- 57 achievements with automated checking (Survivor, Millionaire, Astronaut, Godfather, Monarch, etc.)
- 27 Challenge Mode scenarios with specific victory conditions
- Dynasty Mode: Multi-generational play, inherit as child, family tree, generation bonuses, heirlooms
- Lifetime stats tracking all activities
- Stat history charts (age-based graphs)

### 6.10 Minigames
- Minesweeper (military deployment)
- Burglary minigame (difficulty-based)
- Pickpocket minigame
- Chess game
- Court case game
- Space mission QTE

### 6.11 Save System
- Multi-slot save/load via localStorage
- Auto-save on every state change
- Save metadata (name, age, job, last played)
- Migration from older single-save format

### 6.12 UI Components (71 files)
Main screens: MainMenu, HUD, ActionMenu, EventLog, DecisionModal, GameOver, SystemMenu, SaveSlotMenu, Toast, AvatarCreator, MiniAvatar

Feature menus: OccupationMenu, EducationMenu, AssetsMenu, RelationshipsMenu, ActivitiesMenu, LoveMenu, MafiaMenu, RoyaltyMenu, PoliticsMenu, CrimeMenu, GamblingMenu, SocialMenu, DoctorMenu, PetsMenu, PrisonMenu, StatsMenu, FamilyTreeMenu, WillMenu, HobbiesMenu, BusinessMenu, ImmigrationMenu, InsuranceMenu, FitnessMenu, RetirementMenu, SpaceMenu, PhilanthropyMenu, ClubsMenu, SportsMenu, LawsuitMenu, TimeCapsuleMenu, TravelMap, GeopoliticsModal, RenovationMenu, CareerTreeModal, GoalsPanel, AmbitionsMenu, AnnualRecapModal, AddictionMenu, ChallengeMenu, CareerModal, WorldNewsFeed

Minigame/special: CourtCaseGame, ChessGame, PickpocketMinigame, Minesweeper, SpaceMissionQTE, MiniGameModal

Utility: StatChart, StatsHistoryScreen, OnboardingOverlay, EventLog.css, Hud.css, ActionMenu.css, AmbitionsMenu.css, AnnualRecapModal.css, Modal.css, NewFeatures.css, Toast.css

### 6.13 Internationalization
- English and Arabic with RTL layout
- Language selector on Main Menu and System Menu
- Translation system via `i18n.js`
- Country names translated per locale
- LTR/RTL direction switching (`dir` attribute on `<html>`)

### 6.14 Theming
- CSS custom property theming system
- Multiple themes persisted across sessions
- Dark theme (default), light theme available

---

## 7. QA & Testing

### Unit Tests (13 test files)
- `src/logic/__tests__/` — Person tests, GameEngine tests, Achievements, Ambitions, Annual Recap, Balance, Business, City, Localization, Seasons, Simulation, Systems

### Automated Life Simulation Runner
**`scripts/run-life-simulations.mjs`** — Deterministic QA runner that plays complete lives through the real game engine:

- **Strategies**: balanced, academic, working-class, entrepreneurial, criminal, carefree-spender, passive
- **Invariants**: checks state every year (age, stats, money not NaN/null)
- **Save/load round-trip**: JSON serialization → deserialization → state equality
- **Replay seeds**: every failure includes a reproducible seed
- **Configurable**: cohort sizes 100–2500, multiple strategies, JSON output reports, strict mode for CI/CD

### Commands
```bash
npm run dev               # Start dev server
npm run build             # Production build
npm test                  # Run unit tests
npm run simulate:quick    # 100 lives
npm run balance           # 1,000 lives
npm run simulate -- --replay <seed> --strategy <name>
npm run simulate -- --lives 2500 --seed <name> --strategies balanced,academic,worker
```

---

## 8. Android Build

Build pipeline: `npm run build` → `npx cap sync` → open in Android Studio → Build APK(s).

Full Capacitor Android native project at `android/`:
- Gradle build system (AGP 8.13.2)
- App icons, splash screens, adaptive icons
- Dark/light theme support
- Google Services (Firebase) integration
- Pre-built APK: `LifePath.apk` (at project root)

---

## 9. Key Metrics

| Metric | Count |
|---|---|
| Total commits | 4 |
| Source files (src/) | ~130 |
| UI components | 71 |
| Game logic modules | 57 |
| Life events | 200+ |
| Job definitions | 100+ |
| Achievements | 57 |
| Challenge scenarios | 27 |
| Person.js (lines) | 2,812 |
| GameEngine.js (lines) | 1,126 |
| Events.js (lines) | 1,163+ |
| Locales supported | 2 (English, Arabic) |
| Test files | 13 |
| Minigames | 6 |

---

## 10. How It All Fits Together

1. **`src/main.jsx`** mounts React and sets up Capacitor back-button handling.
2. **`src/App.jsx`** manages a single `person` state object (instance of the `Person` class from `logic/Person.js`) plus modal/view state.
3. The user interacts through **71 component files** — each feature menu reads/writes the person state and calls methods on it.
4. When the user taps "Age Up", **`GameEngine.ageUp(person, worldState)`** runs the yearly loop:
   - Ages the person +1
   - Processes education progression
   - Handles career/promotion/firing
   - Manages asset appreciation, mortgages, rent
   - Processes relationships (conflicts, mortality)
   - Generates random life events from `Events.js`
   - Updates world state (economy, war, pandemic)
   - Checks achievements
   - Triggers auto-save
5. The **Person class** (`2,812 lines`) is the single source of truth — it holds all character data, relationships, assets, education history, crime stats, and every action method (work, study, buy, sell, marry, commit crime, etc.).
6. **Save/load** serializes the Person and world state to JSON in localStorage across multiple save slots.
7. **Dynasty Mode** allows continuing as a child when the current character dies, carrying over heirlooms and generation bonuses.
8. The **automated simulation runner** bypasses the UI and calls the engine directly, playing thousands of lives to find balance issues or crashes.

---

## 11. What Needs Work (Potential Next Steps)

Based on codebase inspection, possible areas for future development:

- **More events** — the 200+ events are extensive but BitLife has thousands
- **More careers** — some common fields (dentist, veterinarian, architect) are absent
- **More countries/cities** — currently a limited set
- **PWA improvements** — offline support, install prompts
- **iOS support** — currently Android-only via Capacitor
- **Online features** — leaderboards, cloud saves, daily challenges
- **Sound/music** — a basic Audio.js exists but could be expanded
- **Accessibility** — screen reader support, color contrast improvements
- **Performance** — Person.js at 2,812 lines could be refactored into smaller modules
- **State management** — could benefit from Context API or a lightweight store instead of prop-drilling from App.jsx
- **More testing** — 13 test files is low for a project of this size
- **More minigames** — currently 6, BitLife has many more
