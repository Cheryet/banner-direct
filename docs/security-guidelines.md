# Security Guidelines

## Auth & Authorization

* Admin routes gated server-side
* Never trust client-side role checks

## Environment Variables

* Secrets never exposed to client
* Server-only access patterns required

## Supabase

* RLS assumed but verified
* UI components never query Supabase

## Forms & Inputs

* Validate inputs
* Sanitize user data

## Anti-Patterns

* Client-side admin logic
* Public exposure of internal IDs
