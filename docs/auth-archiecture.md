# Authentication Architecture

## Purpose

Defines how authentication is structured and why.

## Key Principles

Server components handle layout only

Client components handle all interactivity

Supabase auth never runs server-side

Shared components for login/signup/magic link

## Auth Types Supported

Email + Password

Magic Link (passwordless)

Email Confirmation

## Component Rules

Every auth component must:

Do one thing only

Accept props (no hardcoded copy)

Be reusable across auth flows

Be accessible by default

## Example

PasswordInput does not manage auth

AuthForm orchestrates state

AuthFeedback handles all messages


## UX Principles

Never blame the user

Always explain next steps

Avoid technical jargon

Clear loading feedback

No silent failures

## Copy Examples

❌ “Invalid credentials”
✅ “That email or password doesn’t look right.”

❌ “Email not confirmed”
✅ “Please confirm your email to finish signing in.”

❌ “Account disabled”
✅ “Your account has been disabled. Please contact support for assistance.”

❌ “Too many attempts”
✅ “You’ve tried too many times. Please try again in a moment.”

## Security Rules

No detailed error leakage

No client-side role assumptions

No auth logic in server components

Use Supabase session state only