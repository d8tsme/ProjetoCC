# TODO List for Task Implementation

## 1. Add Sorting Function to All Tables
- [x] LivroTable.jsx: Add onClick sorting to all headers (Páginas, Autor, Gênero, ISBN, Ano, Foto)
- [x] PessoaTable.jsx: Add onClick sorting to Email and Telefone headers
- [x] AutorTable.jsx: Add onClick sorting to Foto header
- [ ] GeneroTable.jsx: No additional headers to sort
- [ ] ReservasAtivasTable.jsx: Already has sorting, ensure all are covered
- [ ] EmprestimosAtivosTable.jsx: Add sorting to headers if needed

## 2. Reduce Size of Actions in Action Bars
- [ ] Add CSS class 'btn-small' to all action buttons in tables
- [ ] Update Button.module.css or add styles for btn-small

## 3. Update Filter by Status for Reserved Books
- [x] LivroTable.jsx: Add "Reservado" option to statusFilter select

## 4. Add Status Tags to Books in Table and Cards
- [x] LivroTable.jsx: Add status column with colored tags (Disponível: green, Emprestado: red, Reservado: yellow)
- [x] LivroTable.jsx: In card view, add status tag to cards

## 5. Fix Loan Page Redirect (Missing Endpoints)
- [x] EmprestimoController.java: Add /emprestimos/listar endpoint
- [x] EmprestimoController.java: Add /emprestimos/devolucao/{id} endpoint
- [x] EmprestimoController.java: Add /emprestimos/{id} DELETE endpoint if needed

## 6. Fix 403 Errors on Reservation Page
- [x] Check ReservaController.java for authorization on /reservas/listar
- [x] Ensure user has ADMIN role or remove @PreAuthorize where appropriate
- [x] Verify token handling in frontend

## 7. Additional Tasks
- [ ] Update EmprestimosConcluidosTable.jsx if needed
- [ ] Update ReservasExpiradasTable.jsx if needed
