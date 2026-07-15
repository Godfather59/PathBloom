# PathBloom: Life Simulator

A comprehensive text-based life simulator game built with React, Vite, and Capacitor for Android. Players start as a newborn and age year-by-year through life, making decisions about education, careers, relationships, crime, investments, hobbies, and more.

## Features

### Core Gameplay
- **Life Stats**: Manage 8 core stats - Happiness, Health, Smarts, Looks, Stress, Karma, Fame, and Energy
- **Year-by-Year Aging**: Experience life from birth to death with annual events and consequences
- **Interactive Events**: 200+ randomized life events with branching choices that impact your life trajectory
- **Birth Traits**: Genius, Athletic, Charismatic, Musical, Reckless, Resilient
- **Skills Development**: Voice, Instruments, Martial Arts, Cooking, Coding

### Career & Education
- **100+ Jobs**: Across 20+ career paths including Tech, Medical, Legal, Military, Entertainment, Sports, Politics, and more
- **Career Skill Tree**: Unlock special abilities and salary multipliers
- **Education System**: Elementary, High School, University (with majors), Graduate School (Medical, Law, Business)
- **Performance Evaluations**: Raises, promotions, firings, and layoffs

### Relationships & Family
- **Advanced Relationship System**: 8 personality profiles with needs, memories, conflicts, and promises
- **Family Interactions**: Dating, proposal, marriage, cheating, divorce, parenting decisions
- **Dynasty Mode**: Build a family legacy across generations
- **Family Tree**: Visual representation of your family connections

### Assets & Economy
- **Real Estate**: Buy, sell, rent properties with appreciation/depreciation
- **Vehicles**: Purchase and maintain cars with condition mechanics
- **Investments**: Stock market, cryptocurrency, individual stocks
- **Business Ownership**: 6 business types with management mechanics
- **Mortgage System**: Down payments, monthly payments, interest rates

### Advanced Features
- **World Simulation**: Economy cycles, conflicts, pandemics, world events
- **Special Career Paths**: Mafia, Royalty, Military, Politics, Space Program
- **Mini-Games**: Chess, Minesweeper, Pickpocket, Court Case, Space Mission QTE
- **Achievements**: 57 achievements to unlock
- **Challenge Mode**: Complete specific life challenges
- **Will & Estate**: Plan your legacy and inheritance
- **Immigration**: Move to different countries
- **Social Media**: Become an influencer with follower mechanics
- **Celebrity System**: Gain fame and handle celebrity events
- **Pets**: Adopt and care for various pets
- **Hobbies**: Practice and develop various hobbies
- **Travel**: Visit different cities with unique events
- **Insurance**: Protect yourself with various insurance policies

### Technical Features
- **Multi-Slot Save System**: Save multiple game sessions
- **Auto-Save**: Automatic saving to prevent progress loss
- **Themes**: Multiple visual themes
- **Internationalization**: English and Arabic with RTL support
- **Responsive Design**: Optimized for mobile devices
- **Performance**: Code splitting, memoized components, bundle optimization

## Architecture

### Project Structure
```
BitLifeClone/
├── src/
│   ├── main.jsx              # React entry point with Capacitor setup
│   ├── App.jsx               # Root component (829 lines) - orchestrates game state
│   ├── components/           # 71 UI components
│   │   ├── Hud.jsx          # Main game HUD with stats
│   │   ├── EventLog.jsx     # Event history display
│   │   ├── ActionMenu.jsx   # Main action buttons
│   │   └── [68 more components]
│   └── logic/               # 57 game logic modules
│       ├── Person.js        # Central data model (2,812 lines)
│       ├── GameEngine.js     # Core game loop (1,126 lines)
│       ├── Events.js         # 200+ event definitions (1,163+ lines)
│       ├── Job.js            # 100+ job definitions (574 lines)
│       └── [53 more modules]
├── android/                  # Capacitor Android native project
├── scripts/                  # Build and utility scripts
└── store-assets/            # Play Store assets
```

### Key Modules

**Person.js**: Central data model containing all player state including stats, relationships, assets, education, career, and game actions.

**GameEngine.js**: Core game loop that processes yearly updates including world simulation, career progression, event generation, and stat consequences.

**Events.js**: Contains 200+ life event definitions with branching choices for different life stages and situations.

**Job.js**: Defines 100+ jobs across various career paths with requirements, salaries, and progression mechanics.

### State Management
- Uses React `useState` for component state
- No external state management library (vanilla React approach)
- LocalStorage for persistence
- Multi-slot save system with metadata

### Performance Optimizations
- React.memo on frequently rendered components (Hud, EventLog, ActionMenu, MiniAvatar)
- Code splitting with React.lazy for modal components
- Manual chunk configuration in Vite for optimal bundle size
- Bundle analysis with rollup-plugin-visualizer

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android builds)

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd BitLifeClone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analysis
- `npm run preview` - Preview production build
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:simulation` - Run simulation tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run simulate` - Run life simulations
- `npm run simulate:quick` - Quick simulation (100 lives)
- `npm run balance` - Balance testing (1000 lives)
- `npm run brand:assets` - Generate brand assets
- `npm run screenshots` - Generate screenshots

### Code Quality

The project uses:
- **ESLint** for code linting with React-specific rules
- **Prettier** for code formatting
- **Vitest** for unit testing
- **Error Boundaries** for graceful error handling

### Testing

#### Unit Tests
```bash
npm run test
```

#### Simulation Tests
The project includes a comprehensive simulation system that plays through complete lives to test game balance and mechanics:

```bash
# Quick test with 100 lives
npm run simulate:quick

# Comprehensive balance test with 1000 lives
npm run balance

# Custom simulation with specific parameters
npm run simulate -- --lives 2500 --seed release-candidate-1 --strategies balanced,academic,worker

# Replay a specific simulation
npm run simulate -- --replay 915621753 --strategy balanced

# Generate machine-readable report
npm run simulate -- --lives 1000 --json --output reports/balance.json
```

## Building for Android

This project uses Capacitor to wrap the web app in a native Android container.

1. **Build the web assets**:
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**:
   ```bash
   npx cap sync
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Build APK**:
   In Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`

5. **Build with bundle analysis**:
   ```bash
   npm run build:analyze
   ```
   This will generate a bundle analysis report in `dist/bundle-analysis.html`

## Configuration

### Environment Variables
No environment variables are required for basic functionality. The app uses:
- LocalStorage for save data
- Capacitor plugins for native functionality

### Capacitor Configuration
Configuration is in `capacitor.config.json` for app settings and Android native configuration.

### Vite Configuration
Build configuration is in `vite.config.js` including:
- Manual chunk splitting for optimal bundle size
- Bundle analysis plugin
- React plugin configuration

## Deployment

### Web Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Ensure proper MIME types are configured

### Android Deployment
1. Build the APK using Android Studio
2. Sign the APK with your release key
3. Upload to Google Play Store

### Version Management
- Version is defined in `package.json`
- Capacitor configuration uses this version
- Update version in both places for releases

## Troubleshooting

### Common Issues

**Build fails with dependency errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Capacitor sync issues**
```bash
npx cap sync android
npx cap copy android
```

**Test failures**
```bash
npm run test:watch
# Check individual test files for specific failures
```

**Performance issues**
- Run `npm run build:analyze` to check bundle size
- Check for unnecessary re-renders using React DevTools
- Ensure React.memo is used on frequently rendered components

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Code Style**: Follow the existing code style (Prettier is configured)
2. **Testing**: Add tests for new features
3. **Documentation**: Update relevant documentation
4. **Commits**: Use clear commit messages

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed as described in the LICENSE file.

## Technologies

- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool and dev server
- **Capacitor 8.0.0** - Mobile wrapper for Android
- **Vitest 4.1.10** - Testing framework
- **ESLint 9.39.1** - Code linting
- **Prettier** - Code formatting
- **Vanilla CSS** - Styling with custom properties

## Credits

Based on the concept of BitLife, expanded with additional features and mechanics.
