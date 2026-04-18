# C# Best Practices

## Naming Conventions
- **PascalCase**: for Classes, Methods, Properties, and Events.
- **camelCase**: for local variables and method parameters.
- **_camelCase**: for private fields.
- Avoid abbreviations (e.g., use `UserAccount` instead of `UA`).

## Async/Await
- Always use `async` / `await` all the way up. Avoid `.Result` or `.Wait()`.
- Suffix async methods with `Async` (e.g., `SaveDataAsync`).
- Use `Task.Delay` instead of `Thread.Sleep`.

## Async/Await Mastery
- **Avoid `async void`**: Generally, only use `async void` for event handlers.
- **Always Await**: Don't fire and forget async calls without being intentional (use a strategy for logging/handling).
- **Anti-Blocking**: Never use `.Result` or `.Wait()` as they cause deadlocks.
- **Task Return**: Always return `Task` or `Task<T>` instead of `void`.
- **Library Code**: Use `.ConfigureAwait(false)` in library/framework code to avoid context synchronization overhead.
- **Granularity**: Keep async methods small and focused.
- **ValueTask**: Use `ValueTask` only when the result is frequently available synchronously.
- **Parallelism**: Use `Task.WhenAll()` to run multiple independent async tasks concurrently.
- **Cancellation**: Always accept and propagate `CancellationToken`.
- **Async Exceptions**: Ensure exceptions are handled correctly within async flows (using try-catch around awaits).
- **The Golden Rule**: "Async all the way down or not at all."

## Clean Code
- **LINQ**: Prioritize readability. Don't chain too many LINQ methods in one line.
- **IDisposable**: Always use the `using` statement or block to ensure resources are disposed.
- **String Interpolation**: Prefer `$"User: {name}"` over `string.Format`.
- **Null Handling**: Use the null-conditional operator `?.` and null-coalescing operator `??`.
- **Exceptions**: Don't use exceptions for flow control. Catch only specific exceptions.

## EF Core Performance
- **Avoid Early Realization**: Don't call `.ToList()` or `.ToArray()` until the query is fully built.
- **Read-Only Tracking**: Use `.AsNoTracking()` for read-only queries to save memory and CPU.
- **Projections**: Load only the properties you need using `.Select()` instead of loading entire entities.
- **N+1 Query Problem**: Use `.Include()` carefully or use projections to avoid multiple trips to the database.
- **Optimized Counts**: Use `.Any()` instead of `.Count() > 0` to check for existence.
- **Efficient Saving**: Batch multiple changes into a single `.SaveChanges()` call.
- **Pagination**: Always use `.Skip()` and `.Take()` for large datasets.
- **Async API**: Use async methods (e.g., `ToListAsync()`, `SaveChangesAsync()`) to prevent thread-pool starvation.
- **Translatability**: Ensure queries are translatable to SQL; avoid complex C# logic inside LINQ expressions.
- **Indexes**: Be aware of missing database indexes on filter/sort columns.

## Production Readiness
- **Health & Monitoring**: Expose `/health` and `/metrics` endpoints for observability.
- **Observability**: Ensure logs include Correlation IDs for distributed tracing. Use structured logging.
- **Rate Limiting**: Protect APIs from abuse with Rate Limiting policies.
- **API Evolution**: Use API Versioning to maintain backward compatibility.
- **Caching**: Implement caching strategies to reduce DB load and improve response times.
- **Real-time**: Consider Server-Sent Events (SSE) or SignalR for live updates.
- **Feature Flags**: Use feature management to decouple deployment from release.
- **Global Error Handling**: Use Middleware or Filters for a centralized exception handling strategy.
- **Resilience**: Use **Polly** for retries, circuit breakers, and fallbacks when calling external services.

## Architecture
- Avoid large classes (God Objects).
- Follow the Dependency Inversion Principle; inject dependencies via constructor.
