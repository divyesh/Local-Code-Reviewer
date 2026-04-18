# Clean Code & Design Patterns

## Clean Code (Robert C. Martin)
- **Functions**: Should be small and do exactly **one thing** (Single Responsibility).
- **Names**: Use intention-revealing names. Classes should be nouns; Methods should be verbs.
- **Comments**: Code should be self-documenting. Comments are only for explaining "Why" a non-obvious decision was made.
- **Boundaries**: Keep your core logic clean of third-party dependencies.
- **Error Handling**: Don't use error codes; use Exceptions. Don't return `null`.

## Design Patterns (GoF)
- **Creational**:
    - **Factory/Abstract Factory**: For decoupling object creation.
    - **Builder**: For complex object construction.
    - **Singleton**: Use sparingly; prefer Dependency Injection.
- **Structural**:
    - **Adapter**: To make incompatible interfaces work together.
    - **Decorator**: To add functionality to an object dynamically.
    - **Facade**: To provide a simplified interface to a large body of code.
- **Behavioral**:
    - **Strategy**: To define a family of algorithms and make them interchangeable.
    - **Observer**: For simplified event-driven architectures.
    - **State**: To allow an object to alter its behavior when its internal state changes.
- **General Principle**: "Favor object composition over class inheritance."
