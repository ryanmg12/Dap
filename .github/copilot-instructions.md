# GitHub Copilot Instructions: React & TypeScript Best Practices

## Project Stack Context
- **Framework**: React 19 (Functional Components & Hooks only)
- **Language**: TypeScript (Strict mode enabled, no `any`)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand

## Component Design Guidelines
- **Naming**: Use PascalCase for file names and components (e.g., `UserCard.tsx`).
- **Signature**: Destructure props directly inside the component function signature.
- **Typing**: Define explicit TypeScript interfaces for all component props.
- **Hook Location**: Place reusable hooks in the `src/hooks/` folder. Do not declare multiple custom hooks inside component files.

## Performance Requirements
- Prefer direct path imports over heavy barrel files to prevent bundle bloating.
- Use `Promise.all()` for independent asynchronous data fetching requests to avoid waterfall delays.

## Code Blueprint Examples

### ❌ BAD (Avoid Class Components and Inline Styles)
```tsx
import React from 'react';
export class Profile extends React.Component {
  render() {
    return <div style={{color: 'red'}}>{this.props.name}</div>;
  }
}
```

### ✅ GOOD (Follow This Exact Pattern)
```tsx
import React from 'react';

interface ProfileProps {
  username: string;
  role: 'admin' | 'user';
}

export const Profile = ({ username, role }: ProfileProps) => {
  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <p className="text-sm font-semibold text-slate-900">{username}</p>
      <span className="text-xs text-blue-600">{role}</span>
    </div>
  );
};
```

## AI Boundaries
- Never rewrite global layout components without an explicit user prompt request.
- Keep components under 150 lines of code; break them into smaller components if they exceed this limit.
