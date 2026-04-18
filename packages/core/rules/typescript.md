# TypeScript & JavaScript Best Practices

## Type Safety (TS)
- **No `any`**: Avoid the `any` type at all costs. Use `unknown` if the type is truly unknown.
- **Strict Typing**: Use explicit return types for public functions and APIs.
- **Interfaces vs Types**: Prefer `interface` for object structures that might be extended. Use `type` for unions/intersections.
- **Enums**: Avoid numeric enums. Use literal type unions (e.g., `'low' | 'high'`) or `const enum`.

## Modern Syntax (ES6+)
- **Airbnb Standard**:
    - Use `const` for all references; avoid `let` unless rebinding is necessary. Never use `var`.
    - Use object and array destructuring.
    - Use template strings instead of concatenation.
    - Use arrow functions for anonymous callbacks.
- **Nullish Handling**: Use `??` (nullish coalescing) and `?.` (optional chaining).

## Clean Logic
- **Modules**: Always use ES Modules (`import`/`export`).
- **Conditionals**: Avoid deep nesting. Use early returns (Guard Clauses).
- **Immutability**: Avoid mutating parameters; return new objects/arrays instead.
