CREATE TABLE Usuario(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255),
    senha VARCHAR(255)
);

CREATE TABLE Pessoa(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255),
    telefone INT
);

CREATE TABLE Genero(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50)
);

CREATE TABLE Autor(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    foto LONGTEXT
);

CREATE TABLE Livro(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    isbn  VARCHAR(255),
    ano_publicacao int,
    paginas int,
    foto LONGTEXT,
    status VARCHAR(255),
    autor_id INT,
    genero_id INT,

    FOREIGN KEY (autor_id) REFERENCES autor(id),
    FOREIGN KEY (genero_id) REFERENCES genero(id)
);

CREATE TABLE Emprestimo(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_emprestimo DATE,
    data_devolucao DATE,
    status VARCHAR(255),
    livro_id INT,
    pessoa_id INT,

    FOREIGN KEY (livro_id) REFERENCES livro(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);

CREATE TABLE Reserva(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_reserva DATE,
    data_validade DATE,
    livro_id INT,
    pessoa_id INT,

    FOREIGN KEY (livro_id) REFERENCES livro(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);