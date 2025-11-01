# Project Overview

This is a React Native UI kit project based on Prime Faces and Prime Flex. It provides a set of reusable UI components for building React Native applications. The project is configured with Storybook for component development and testing.

**Key Technologies:**

*   React Native
*   Expo
*   Storybook
*   TypeScript
*   Jest
*   ESLint
*   Prettier
*   Yarn

# Building and Running

**Installation:**

```shell
yarn install
```

**Running Storybook:**

*   `yarn start`: Starts the Metro Bundler for Storybook.
*   `yarn ios`: Runs Storybook on the iOS simulator.
*   `yarn android`: Runs Storybook on the Android emulator.

**Building the library:**

```shell
yarn build
```

**Testing:**

```shell
yarn test
```

**Linting and Formatting:**

*   `yarn lint:check`: Checks for linting errors.
*   `yarn lint:fix`: Fixes linting errors.
*   `yarn prettier:check`: Checks for formatting errors.
*   `yarn prettier:fix`: Formats the code.

# Development Conventions

*   **Component Development:** Components are developed in isolation and showcased in Storybook.
*   **Styling:** The project uses a theming approach, with `lightTheme` and `darkTheme` defined.
*   **Testing:** Tests are written with Jest and React Native Testing Library.
*   **Commits:** The project follows the Conventional Commits specification for commit messages.
*   **Code Style:** The project uses ESLint and Prettier to enforce a consistent code style.
