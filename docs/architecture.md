# Architecture Standards

## Purpose

Prevent architectural drift and ensure long-term scalability, security, and predictability.

## App Router Structure

* `app/` is the source of truth for routing
* `page.js` orchestrates data and composes UI
* `layout.js` defines structure only
* No business logic or heavy JSX in layouts

## Server vs Client Components

* Server Components are the default
* Use `"use client"` only when interactivity is required
* Client logic must be isolated to leaf components
* Parents remain server-side whenever possible

## Data Flow Rules

* Data flows top-down
* Supabase queries allowed only in:

  * Server components
  * Server actions
  * API routes
* UI components receive data via props only

## Folder Responsibilities

* `components/ui` → generic reusable UI
* `components/layout` → structural UI
* `components/forms` → controlled input + submission
* `components/admin` → admin-only UI
* `components/client` → client-facing UI

## Anti-Patterns

* Supabase logic inside UI components
* Client-side admin gating
* Shared state across unrelated domains
