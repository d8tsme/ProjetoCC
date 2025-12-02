import Form from '../../components/Formfolder/Form';
import './Login.css';

export default function Login() {
  return (
    <div className="login-page full-viewport">
      <div className="login-split">
        <aside className="login-left" style={{ backgroundImage: `url('/terf.jpg')` }}>
          <div className="photo-credit">Photo by Pinkbadger</div>
        </aside>

        <main className="login-right">
          <div className="login-card fade-in">
            <header className="login-panel-header">
              <h1 className="login-brand-title">Biblio.<br></br>tech</h1>
              <p className="login-brand-subtitle">Que bom te ver de novo!</p>
            </header>

            <section className="login-panel-body">
              <Form />
            </section>

            <footer className="login-panel-footer">© Bibliotech 2025</footer>
          </div>
        </main>
      </div>
    </div>
  );
}
