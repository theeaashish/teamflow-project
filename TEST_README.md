# Test Suite Documentation

This project now includes a comprehensive unit test suite using **Vitest** and **React Testing Library**.

## 📋 Test Coverage

The following files have been thoroughly tested:

### Pure Functions & Utilities
- **`lib/get-avatar.ts`** - Avatar URL generation logic
- **`lib/serializer.ts`** - Data serialization/deserialization
- **`lib/query/client.ts`** - React Query client configuration

### Schemas
- **`app/schemas/workspace.ts`** - Workspace validation schema

### Components
- **`app/(dashboard)/workspace/_components/WorkspaceList.tsx`** - Workspace list rendering
- **`app/(dashboard)/workspace/_components/CreateWorkspace.tsx`** - Workspace creation form

### Router Functions
- **`app/router/workspace.ts`** - Workspace API endpoints logic

## 🚀 Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode (recommended for development)
```bash
pnpm test
```

### Run tests once (CI/CD)
```bash
pnpm test:run
```

### Run tests with UI
```bash
pnpm test:ui
```

### Generate coverage report
```bash
pnpm test:coverage
```

## 📁 Test Structure

Tests are co-located with their source files in `__tests__` directories: