# Supabase Setup Guide

## Creating the Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Note down the **Project URL** and **anon public key**.

## Running Migrations
1. Open the SQL Editor in your Supabase dashboard.
2. Copy and paste the contents of `migrations/20231010000000_initial_schema.sql` and run it.
3. This will create all tables, relationships, and Row Level Security (RLS) policies.

## Authentication Setup
1. In Supabase, go to Authentication > Providers.
2. Ensure Email/Password is enabled.
3. (Optional) Disable email confirmations for testing/development.

## Storage
1. If uploading images directly, create public buckets for `products` and `artisans`.

## Edge Functions
1. Install Supabase CLI.
2. Create functions for AI interactions.
