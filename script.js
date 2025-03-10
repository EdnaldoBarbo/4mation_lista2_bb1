const tabuleiro = document.getElementById("tabuleiro");
const mensagem = document.getElementById("mensagem");
const tamanho = 7; // Tamanho do tabuleiro (7x7)
let grade = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
let jogadorAtual = "azul";
let ultimoMovimento = null;
let jogoAcabou = false;

// Cria o tabuleiro
function criarTabuleiro() {
    tabuleiro.innerHTML = ""; // Limpa o tabuleiro antes de criar
    for (let linha = 0; linha < tamanho; linha++) {
        for (let coluna = 0; coluna < tamanho; coluna++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;
            celula.addEventListener("click", fazerMovimento);
            tabuleiro.appendChild(celula);
        }
    }
    destacarMovimentosValidos();
}

// Realiza um movimento
function fazerMovimento(evento) {
    if (jogoAcabou) return;

    const linha = parseInt(evento.target.dataset.linha);
    const coluna = parseInt(evento.target.dataset.coluna);

    if (grade[linha][coluna] !== null) return; // Célula já ocupada
    if (ultimoMovimento && !movimentoValido(linha, coluna)) return; // Movimento inválido

    grade[linha][coluna] = jogadorAtual;
    evento.target.classList.add(jogadorAtual);
    ultimoMovimento = { linha, coluna };

    const sequenciaVencedora = verificarVitoria(linha, coluna);
    if (sequenciaVencedora) {
        destacarSequenciaVencedora(sequenciaVencedora);
        setTimeout(() => {
            mensagem.textContent = `Jogador ${jogadorAtual} venceu!`;
            jogoAcabou = true;
        }, 500); // Exibe a mensagem após 500ms
        return;
    }

    if (grade.flat().every(celula => celula !== null)) {
        mensagem.textContent = "Empate!";
        jogoAcabou = true;
        return;
    }

    jogadorAtual = jogadorAtual === "azul" ? "vermelho" : "azul";
    mensagem.textContent = `Vez do jogador ${jogadorAtual}`;
    destacarMovimentosValidos();
}

// Verifica se o movimento é válido
function movimentoValido(linha, coluna) {
    if (!ultimoMovimento) return true; // Primeiro movimento é sempre válido
    const { linha: ultimaLinha, coluna: ultimaColuna } = ultimoMovimento;
    return Math.abs(linha - ultimaLinha) <= 1 && Math.abs(coluna - ultimaColuna) <= 1;
}

// Destaca os movimentos válidos
function destacarMovimentosValidos() {
    document.querySelectorAll(".celula").forEach(celula => celula.classList.remove("destacada"));
    if (!ultimoMovimento) return;

    for (let linha = 0; linha < tamanho; linha++) {
        for (let coluna = 0; coluna < tamanho; coluna++) {
            if (grade[linha][coluna] === null && movimentoValido(linha, coluna)) {
                document.querySelector(`[data-linha='${linha}'][data-coluna='${coluna}']`).classList.add("destacada");
            }
        }
    }
}

// Verifica se há um vencedor e retorna a sequência vencedora
function verificarVitoria(linha, coluna) {
    const direcoes = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal principal
        [[1, -1], [-1, 1]]  // Diagonal secundária
    ];

    for (let [[dl1, dc1], [dl2, dc2]] of direcoes) {
        const sequencia = [{ linha, coluna }];
        sequencia.push(...contarDirecao(linha, coluna, dl1, dc1));
        sequencia.push(...contarDirecao(linha, coluna, dl2, dc2));
        if (sequencia.length >= 4) {
            return sequencia.slice(0, 4); // Retorna as 4 primeiras células da sequência
        }
    }
    return null;
}

// Conta células consecutivas na mesma direção e retorna suas coordenadas
function contarDirecao(linha, coluna, deltaLinha, deltaColuna) {
    let l = linha + deltaLinha, c = coluna + deltaColuna;
    const sequencia = [];
    while (l >= 0 && l < tamanho && c >= 0 && c < tamanho && grade[l][c] === jogadorAtual) {
        sequencia.push({ linha: l, coluna: c });
        l += deltaLinha;
        c += deltaColuna;
    }
    return sequencia;
}

// Destaca a sequência vencedora
function destacarSequenciaVencedora(sequencia) {
    sequencia.forEach(({ linha, coluna }) => {
        const celula = document.querySelector(`[data-linha='${linha}'][data-coluna='${coluna}']`);
        celula.classList.add("vencedora");
    });
}

// Inicializa o jogo
criarTabuleiro();