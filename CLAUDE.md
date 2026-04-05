# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + Tailwind CSS site that recreates a vintage 1970s-style "IC Evaluation Form" — modeled after the famous 1977 Apple Computer evaluation document (screenshot included as reference) — themed for the Zenon Network (NoM) cryptocurrency project.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

## Architecture

- **Vite + React + Tailwind CSS v4** (via `@tailwindcss/vite` plugin).
- Single-page app: `src/App.jsx` contains all components (`Label`, `Value`, `SectionLabel`, `SectionValue`, `TableRow`).
- Custom Tailwind theme tokens defined in `src/index.css` under `@theme`: `font-typewriter`, `font-handwritten`, `color-ink`, `color-pen`, `color-paper`, `color-desk`, `color-section-bg`.
- The original standalone HTML version is preserved as `zenon_evaluation_form.html` for reference.

## Key Design Conventions

- **Labels** use `font-typewriter` (Courier Prime) in `text-ink` (`#1a1a1a`) — "printed" form fields.
- **Values** use `font-handwritten` (Special Elite) in `text-pen` (`#2c5aa0`) — simulates handwritten/typed-in entries.
- Aged paper effect: CSS radial gradients for staining, a separate div for the coffee ring, box-shadow for depth.
- Fonts loaded from Google Fonts via `@import` in `index.css`.
