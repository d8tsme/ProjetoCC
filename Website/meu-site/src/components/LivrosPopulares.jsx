import styles from "./LivrosPopulares.module.css";
import Card from "./UI/Card";
import Button from "./UI/Button";

export default function LivrosPopulares() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2>Livros Populares</h2>
          <span>Aqui está nosso melhor acervo!</span>
        </div>

        <Button>Adicionar Livro +</Button>
      </div>

      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <div className={styles.bookRow}>
            <div className={styles.photo}>book<br />photo</div>

            <div className={styles.info}>
              <h3>Book Title</h3>
              <p>Author • Publish date</p>
              <p>Gênero • Pages</p>
            </div>

            <div className={styles.tools}>
              <button className={styles.iconBtn}>✏️</button>
              <button className={styles.iconBtn}>🗑️</button>
              <Button variant="secondary">Status</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
