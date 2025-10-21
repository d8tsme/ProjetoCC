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
    anoPublicacao int,
    paginas int,
    foto VARCHAR(255),
    status VARCHAR(255),
    autorId INT,
    generoId INT,

    FOREIGN KEY (autorId) REFERENCES autor(id),
    FOREIGN KEY (generoId) REFERENCES genero(id)
);

CREATE TABLE Emprestimo(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dataEmprestimo DATE,
    dataDevolucao DATE,
    status VARCHAR(255),
    livroId INT,
    pessoaId INT,

    FOREIGN KEY (livroId) REFERENCES livro(id),
    FOREIGN KEY (pessoaId) REFERENCES pessoa(id)
);

CREATE TABLE Reserva(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dataReserva DATE,
    dataValidade DATE,
    livroId INT,
    pessoaId INT,

    FOREIGN KEY (livroId) REFERENCES livro(id),
    FOREIGN KEY (pessoaId) REFERENCES pessoa(id)
);