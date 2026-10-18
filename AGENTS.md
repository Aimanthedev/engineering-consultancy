<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Studio Command is a UI-only demo: all data is seeded in src/lib/data.ts and mutated only in local component state — the brief forbids a backend, auth or external APIs.
- Shared studio UI primitives (Panel, Pill, Kpi, Bar, Ring) live in src/components/studio/ui.tsx; the app shell (sidebar, topbar, ⌘K, quick create) is in Shell.tsx, mounted in __root — reuse these rather than restyling per page.
