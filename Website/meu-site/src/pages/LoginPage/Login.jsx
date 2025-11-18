import Form from '../../components/Formfolder/Form';
import LogoPeople from './logo-people.svg';

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <div className="login-header">
          <img src={LogoPeople} alt="logo" className="login-brand-icon" />
          <h1 className="login-brand-title">Bibliotech™</h1>
          <p className="login-brand-subtitle">Use sua conta para entrar.</p>
        </div>

        <div className="login-body">
          <Form />
        </div>
      </div>
    </div>
  );
}
