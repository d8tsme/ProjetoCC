# Bibliotech Frontend (meu-site)

This frontend is a React app used as the UI for the Bibliotech Virtual Library.

What I implemented in this iteration:
- A Dashboard page (`/dashboard`) with charts and summary cards (warm dark-brown theme).
- A Books-focused catalog on the Main page (`/main`) showing responsive book cards, with Edit and Remove actions.
- CRUD helpers for entities: Add forms for Autor, Genero, Pessoa, and Livro already present; I added an `EditLivroCard` for editing books.
- Navbar improvements: search bar, theme (light/dark) toggle persisted in `localStorage`, and Logoff button.
- Dark-mode CSS overrides and cohesive warm theme adjustments.

How to run (development):

1. From the project root open a terminal and go to the frontend folder:

```powershell
cd Website\meu-site
npm install
npm start
```

Note: I added `recharts` as a dependency for improved charts — if you already ran `npm install` before my change, run `npm install` again so `recharts` is installed.

Notes about API:
- The frontend expects the backend API to be available at the same origin, so calls like `/livros/listar`, `/autores/listar`, etc. are used by `utils/apiFetch.js`.
- Authentication: `utils/apiFetch.js` will send a bearer token from `sessionStorage.getItem('token')` when present. Login page must set that token in sessionStorage after successful authentication.
- For book deletion the UI sends an update request that marks the book `status` as `Removido` by calling `PUT /livros/atualizar/{id}`. The backend currently does not expose a DELETE endpoint for books, so this approach performs a logical removal.

Files added/updated of interest:
- `src/pages/DashboardPage/Dashboard.jsx` and `Dashboard.css`
- `src/components/DashboardComponents/*` (small chart & stat components)
- `src/components/BookFormFolder/BooksCatalog.jsx`, `BookCard.jsx`, `EditLivroCard.jsx`
- `src/components/Navbarfolder/Navbar.js` (search, theme, logout)
- `src/styles.css` (dark-mode additions)

Next recommended steps:
- Add server-side analytics endpoints to feed real dashboards (monthly users, sales, etc.).
- Add unit/integration tests for catalog behavior and form validation.
- Optionally add pagination and sorting to the book catalog.

If you want, I can now:
- Hook up the login page to produce a real token (if auth endpoint exists).
- Add a dedicated Books page route and toggle between grid/table views.
- Add export/CSV and bulk actions for books.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
