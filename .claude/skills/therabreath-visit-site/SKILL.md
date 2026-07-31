```markdown
# therabreath-visit-site Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `therabreath-visit-site` JavaScript codebase. The repository does not use a framework and follows specific conventions for file naming, imports, exports, and testing. This guide will help you contribute code that matches the established style and workflows.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `visitSiteHandler.js`, `userProfileUtils.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { fetchData } from './apiUtils';
    ```

### Export Style
- Use **named exports** for all exported functions or variables.
  - Example:
    ```javascript
    // In utils.js
    export function calculateVisitDuration(start, end) {
      return end - start;
    }

    // In another file
    import { calculateVisitDuration } from './utils';
    ```

### Commit Messages
- Commit messages are **freeform** and do not follow a strict prefix or format.
- Average commit message length is about 55 characters.

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new feature or functionality  
**Command:** `/add-feature`

1. Create a new file using camelCase naming (e.g., `newFeature.js`).
2. Write your code using named exports.
3. Use relative imports to include any dependencies.
4. Write corresponding tests in a `*.test.*` file.
5. Commit your changes with a descriptive message.

#### Example:
```javascript
// newFeature.js
export function newFeatureLogic(params) {
  // feature implementation
}

// usage in another file
import { newFeatureLogic } from './newFeature';
```

### Fixing a Bug
**Trigger:** When resolving a bug or issue  
**Command:** `/fix-bug`

1. Identify the file(s) where the bug exists.
2. Make the necessary code changes.
3. Update or add tests in the corresponding `*.test.*` file.
4. Commit your changes with a message describing the fix.

### Writing Tests
**Trigger:** When adding or updating tests  
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.*` (e.g., `visitSiteHandler.test.js`).
2. Write tests for your functions or modules.
3. Run the tests using the project's test runner (framework is unspecified; check project documentation or package.json for details).
4. Commit the test file(s).

#### Example:
```javascript
// visitSiteHandler.test.js
import { visitSiteHandler } from './visitSiteHandler';

test('should handle site visit correctly', () => {
  // test implementation
});
```

## Testing Patterns

- Test files follow the pattern: `*.test.*` (e.g., `feature.test.js`).
- The testing framework is **unknown**; check the project for more details.
- Place tests alongside the files they test or in a dedicated test directory.
- Tests should cover all named exports and key logic.

## Commands

| Command      | Purpose                                   |
|--------------|-------------------------------------------|
| /add-feature | Start the workflow for adding a new feature|
| /fix-bug     | Begin the bug fixing workflow             |
| /write-test  | Add or update tests for your code         |
```
