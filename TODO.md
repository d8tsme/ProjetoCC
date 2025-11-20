
# Project TODO (consolidated)

This file tracks the current workplan created by the assistant. Each task includes brief validation steps.

## High Priority

- [ ] Secure Emprestimo API call
  - Ensure GET `/emprestimos` includes Bearer token from `sessionStorage` and handle 401/403 with friendly UI.
  - Validation: 1) Trigger a 401 and confirm UI shows a clear message; 2) On success the emprestimos list loads.

- [ ] Implement backend cadastro endpoints (Pessoa & Usuario)
  - Add JPA entities, repositories, DTOs and controllers for `Pessoa` and `Usuario`. Return JWT on registration/login.
  - Validation: POST `/usuarios/registrar` returns 201 and a response with JWT and role; DB has `pessoa` and `usuario` rows.

- [ ] Add `role` field to Usuario and include it in JWT
  - Add `role` property (`ROLE_USER` | `ROLE_ADMIN`), include claim in JWT and in login response.
  - Validation: login response includes `role` and JWT payload contains the role claim.

- [ ] Solicitacao entity + admin approval flow
  - Create `Solicitacao` entity and endpoints: create, list (admin), approve, reject. Frontend: user submit form; admin panel to manage.
  - Validation: user creates PENDING solicitacao; admin approves and status updates to APPROVED.

## Frontend / UX

- [ ] Frontend role-based access control
  - Protect routes/pages (Pessoas, Usuarios, Autores, Generos, Dashboard) by checking role from login response/JWT. Show access denied UI for insufficient role.
  - Validation: admin sees admin routes; normal user sees Access Denied when accessing admin routes.

- [x] Form and modal UX polish (AddLivro modal fix)
  - Ensure `.form-card` has `max-height: 90vh; display:flex; flex-direction:column;` and `.form-body { overflow:auto; flex:1 }`. Make `.form-actions` sticky at bottom.
  - Validation: On small screens modal scrolls internally and submit button remains reachable.

- [ ] Design tokens and style sweep
  - Finalize CSS variables (colors, fonts, spacing) in `src/styles.css` and replace remaining hard-coded colors.
  - Validation: run app and visually confirm color consistency and no remaining hex or inline color usages in core components.

- [ ] API error handling & `apiFetch` improvements
  - Ensure `apiFetch` returns structured errors `{status,message,details}` and callers render messages (avoid object-to-React-child errors).
  - Validation: induce 400/401/403 and confirm UI shows `error.message` not object dump.

## Backend: Validation, Pagination & Migrations

- [ ] DTOs and validation
  - Add DTO classes (e.g., `DadosCadastroUsuario`, `DadosLogin`, `DadosRespostaLogin`) and use `@Valid` + bean validation annotations.
  - Validation: missing required fields cause 400 with structured error body.

- [ ] Pagination & sorting
  - Use Spring Data `Pageable` for list endpoints and accept `page`, `size`, `sort` query params.
  - Validation: GET `/pessoas?page=0&size=5` returns `content` with up to 5 items and page metadata.

- [ ] Flyway migrations
  - Add migration files to create `usuario`, `pessoa`, and `solicitacao` tables.
  - Validation: start app and confirm Flyway applies migrations.

## Testing & Verification

- [ ] Unit & integration tests
  - Backend tests for registration/login (JWT contains role) and solicitacao lifecycle. Frontend integration for role UI.
  - Validation: run test suite and ensure new tests pass.

## Notes and Best Practices

- Token storage: store token in `sessionStorage`; store role in memory or `localStorage` if UI must persist across reloads.
- Passwords: hash with BCrypt; never return raw passwords.
- Roles: prefer enums server-side (map to strings in DB and JWT).
- UI: show inline toasts/alerts for errors; avoid hard SPA redirects on auth errors.

## Current Status

- Form/modal UX polish: IN-PROGRESS (AddLivro modal fix applied)
- All other tasks: NOT STARTED

