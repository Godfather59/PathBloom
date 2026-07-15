# Contributing to PathBloom: Life Simulator

Thank you for your interest in contributing to PathBloom! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and constructive in all interactions
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Android Studio (for Android builds, optional)

### Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/your-username/BitLifeClone.git
   cd BitLifeClone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

We use automated tools to maintain consistent code style:

- **Prettier** for code formatting
- **ESLint** for code quality
- **React-specific linting rules**

Before committing, run:
```bash
npm run format
npm run lint:fix
```

### Code Organization

#### Component Structure
- Keep components focused and single-purpose
- Use functional components with hooks
- Implement `React.memo` for frequently rendered components
- Extract reusable logic into custom hooks

#### File Naming
- Components: PascalCase (e.g., `PersonCard.jsx`)
- Utilities: camelCase (e.g., `formatMoney.js`)
- Styles: camelCase matching component (e.g., `PersonCard.css`)
- Tests: `.test.js` suffix (e.g., `person.test.js`)

#### Folder Structure
```
src/
├── components/        # Reusable UI components
├── logic/            # Game logic and business rules
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
└── assets/           # Static assets
```

### Best Practices

#### React Components
- Use functional components with hooks
- Implement proper prop validation (consider TypeScript in future)
- Use `React.memo` for performance optimization
- Implement proper cleanup in useEffect
- Avoid unnecessary re-renders

#### State Management
- Use the most local state possible
- Lift state only when necessary
- Consider context for truly global state
- Maintain immutability for state updates

#### Performance
- Implement code splitting for large components
- Use lazy loading for modals and routes
- Optimize bundle size with manual chunking
- Monitor performance with React DevTools

#### Error Handling
- Implement error boundaries for graceful degradation
- Provide meaningful error messages
- Log errors appropriately
- Consider user experience in error states

### Testing

#### Unit Tests
- Write tests for new logic modules
- Test edge cases and error conditions
- Keep tests fast and focused
- Use descriptive test names

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- person.test.js
```

#### Simulation Tests
- Use the simulation system for balance testing
- Test new game mechanics with various strategies
- Ensure save/load functionality works correctly

```bash
# Quick simulation test
npm run simulate:quick

# Comprehensive balance test
npm run balance
```

#### Component Testing
We plan to add React Testing Library for component testing. For now, manual testing is required for UI changes.

## Git Workflow

### Commit Messages

Follow the conventional commit format:
```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(relationships): add promise system to relationships
fix(career): correct salary calculation for promotions
docs(readme): update installation instructions
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `test/` - Test additions/changes

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run linting and formatting**:
   ```bash
   npm run lint:fix
   npm run format
   ```
4. **Run tests**:
   ```bash
   npm run test
   npm run simulate:quick
   ```
5. **Update CHANGELOG.md** if applicable
6. **Create pull request** with:
   - Clear description of changes
   - Related issue numbers
   - Screenshots for UI changes
   - Testing instructions

### Review Process

- Maintainers will review your PR
- Address review feedback promptly
- Keep discussion focused and constructive
- Update your branch as needed

## Project-Specific Guidelines

### Game Logic

#### Adding New Features
- Consider impact on game balance
- Test with simulation system
- Update relevant documentation
- Consider save/load compatibility

#### Adding New Events
- Follow existing event structure in `Events.js`
- Include age-appropriate events
- Balance probability and consequences
- Add localization keys for text

#### Adding New Jobs
- Follow existing job structure in `Job.js`
- Set appropriate requirements and salary
- Consider career progression
- Add to appropriate career path

### UI Components

#### Styling
- Use existing CSS variables from `index.css`
- Follow the established dark theme
- Ensure mobile responsiveness
- Test on different screen sizes

#### Accessibility
- Use semantic HTML
- Ensure keyboard navigation
- Provide ARIA labels where needed
- Test with screen readers if possible

### Internationalization

- Add new text to `i18n.js`
- Provide translations for all supported languages
- Test RTL layout for Arabic
- Consider cultural appropriateness

## Common Tasks

### Adding a New Component

1. Create component file in `src/components/`
2. Create corresponding CSS file
3. Implement component with proper props
4. Add React.memo if frequently rendered
5. Add tests if logic is complex
6. Export and import where needed

### Adding New Game Logic

1. Create logic file in `src/logic/`
2. Implement logic with proper functions
3. Add comprehensive tests
4. Update Person.js if needed
5. Integrate with GameEngine.js
6. Test with simulation system

### Fixing Bugs

1. Reproduce the bug consistently
2. Add test case that fails
3. Fix the bug
4. Ensure test passes
5. Check for similar issues
6. Update documentation if needed

## Resources

### Documentation
- [README.md](README.md) - Project overview and setup
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Detailed project documentation
- React Documentation - https://react.dev/
- Vite Documentation - https://vitejs.dev/
- Capacitor Documentation - https://capacitorjs.com/

### Tools
- React DevTools - Browser extension for React debugging
- Prettier - Code formatter
- ESLint - Code linter
- Vitest - Testing framework

## Questions?

Feel free to open an issue for questions or discussion about contributions.

## License

By contributing to PathBloom, you agree that your contributions will be licensed under the same license as the project.