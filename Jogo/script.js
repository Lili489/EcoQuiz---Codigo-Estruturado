// referências aos elementos da página (pega coisas do HTML pelo ID) 
// Aqui usamos variáveis globais
const startScreen = document.getElementById('startScreen');               // pega a tela inicial
const gameScreen = document.getElementById('gameScreen');                // pega a tela do jogo
const startBtn = document.getElementById('startBtn');                   // pega o botão iniciar
 
const questionText = document.getElementById('questionText');             // onde aparece a pergunta
const answers = Array.from(document.querySelectorAll('.answer'));        // pega todos os botões de resposta
const timeLeftEl = document.getElementById('timeLeft');                 // mostra quanto tempo falta
const scoreValueEl = document.getElementById('scoreValue');            // mostra os pontos do jogador
const nextBtn = document.getElementById('nextBtn');                   // botão de próxima pergunta
const endBtn = document.getElementById('endBtn');                    // botão de encerrar jogo
 
let vidas = 3;                                                      // número de vidas que o jogador começa
const livesEl = document.getElementById('lives');                  // lugar onde os corações aparecem
 
// função para atualizar os corações na tela
function atualizarVidas() {                                    
   // Aqui é um exemplo de variável local
  const max = 3;                                                               // máximo de vidas
  const filled = "❤️".repeat(Math.max(0, Math.min(vidas, max)));              // cria corações cheios
  const empty = "🤍".repeat(Math.max(0, max - Math.max(0, vidas)));          // cria corações vazios
  if (livesEl) {                                                             // se existir a área dos corações
    livesEl.innerHTML = filled + empty;                                     // mostra os corações juntos
  }
}

 // Aqui usamos variáveis globais
let timePerQuestion = 10;                                 // tempo para responder cada pergunta
let timerInterval = null;                                // guardará o temporizador do relógio
let score = 0;                                          // pontuação do jogador
 
// Música do jogo
const gameMusic = document.getElementById('gameMusic');                     // pega o áudio do HTML
 
// lista de perguntas do jogo
const perguntas = [
  {
    pergunta: "O que pode ser reciclado infinitas vezes?",                 // texto da pergunta
    opcoes: ["Vidro", "Alumínio", "Aço inoxidável", "Cobre"],             // alternativas
    correta: 0                                                           // Posição da resposta
  },
  {
    pergunta: "Qual é a principal causa do aquecimento global?",
    opcoes: ["Queima de biomassa", "Efeito estufa natural", "Emissão de CO₂", "Oscilações climáticas naturais"],
    correta: 2
  },
  {
    pergunta: "O que é considerado resíduo orgânico?",
    opcoes: ["Plástico biodegradável", "Restos de comida", "Papel reciclado", "Borracha natural"],
    correta: 1
  },
  {
    pergunta: "Qual hábito ajuda a economizar água?",
    opcoes: ["Lavar o carro todos os dias", "Usar redutor de pressão", "Fechar parcialmente o registro", "Fechar a torneira"],
    correta: 3
  },
  {
    pergunta: "Qual é a função essencial da Floresta Amazônica?",
    opcoes: ["Produzir madeira tropical", "Atrair umidade regional", "Regular o clima", "Conter erosão"],
    correta: 2
  },
  {
    pergunta: "Qual atividade polui o ar?",
    opcoes: ["Uso de geradores elétricos", "Cozimento a lenha", "Queima de combustíveis fósseis", "Evaporação de solventes"],
    correta: 2
  },
  {
    pergunta: "Qual material demora centenas de anos para se decompor?",
    opcoes: ["Papel vegetal grosso", "Plástico", "Nylon industrial", "Fibras sintéticas"],
    correta: 1
  },
  {
    pergunta: "Qual material é totalmente reciclável?",
    opcoes: ["Madeira tratada", "Isopor prensado", "Alumínio", "Borracha vulcanizada"],
    correta: 2
  },
  {
    pergunta: "O que aumenta a ocorrência de eventos climáticos extremos?",
    opcoes: ["Abertura de áreas agrícolas", "Chuvas intensas repentinas", "Aquecimento global", "Fenômenos oceânicos cíclicos"],
    correta: 2
  },
  {
    pergunta: "Qual é a cor da lixeira usada para plástico?",
    opcoes: ["Vermelho", "Amarelo queimado", "Laranja vivo", "Vermelho escuro"],
    correta: 0
  },
  {
    pergunta: "Qual tipo de plástico é o mais difícil de reciclar?",
    opcoes: ["PET reciclado", "Polipropileno colorido", "Poliestireno expandido", "PVC"],
    correta: 3
  },
  {
    pergunta: "Qual gás de efeito estufa tem maior capacidade de aquecimento a curto prazo?",
    opcoes: ["Dióxido de carbono (CO₂)", "Metano (CH₄)", "Óxido nitroso (N₂O)", "Ozônio troposférico (O₃)"],
    correta: 1
  },
  {
    pergunta: "Por que o vidro é considerado um dos melhores materiais para reciclagem?",
    opcoes: [
      "Porque pode ser reciclado infinitamente",
      "Porque exige pouca energia para ser fundido",
      "Porque não perde qualidade ao ser reaproveitado",
      "Porque é barato de transportar"
    ],
    correta: 0
  },
  {
    pergunta: "O derretimento do permafrost libera qual gás?",
    opcoes: ["Vapor d’água", "Dióxido de carbono", "Metano (CH₄)", "Óxido nitroso"],
    correta: 2
  },
  {
    pergunta: "Qual componente eletrônico é mais perigoso ao ser descartado incorretamente?",
    opcoes: ["Transformador industrial", "Capacitor de alta voltagem", "Fonte chaveada", "Bateria de lítio"],
    correta: 3
  }
];
 
let perguntaIndex = 0;                                   // diz qual pergunta estamos agora
let timeLeft = timePerQuestion;                         // guarda o tempo restante
 
// função que inicia o jogo
function startGame() {
  startScreen.classList.add('hidden');                 // esconde a tela inicial
  gameScreen.classList.remove('hidden');              // mostra a tela do jogo
  score = 0;                                         // zera pontos
  vidas = 3;                                        // reseta vidas
  atualizarVidas();                                // mostra corações
  scoreValueEl.textContent = score;               // mostra o zero na pontuação
  perguntaIndex = 0;                             // começa pela primeira pergunta

  
  embaralharPerguntas(perguntas);               // Agora as perguntas mudam de ordem toda vez

  showQuestion();                               // mostra ela na tela
  gameMusic.play().catch(err => console.log("Erro ao tocar música:", err));         // tenta tocar música
}

function embaralharPerguntas(lista) {                // Função que embaralha as perguntas ao reiniciar o jogo
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]]; 
  }
}
 
// função que limpa botões de resposta entre uma pergunta e outra
function resetAnswers() {
  if (timerInterval) clearInterval(timerInterval);                // para o timer se estiver rodando
  answers.forEach(btn => {
    btn.disabled = false;                                        // ativa os botões
    btn.style.background = '';                                  // tira cores de certo/errado
  });
}
 
// função que mostra a pergunta na tela
function showQuestion() {
  resetAnswers();                                                     // limpa estado anterior
  // outro exemplo de variável local
  const q = perguntas[perguntaIndex];                                // pega a pergunta atual
  questionText.textContent = q.pergunta;                            // escreve a pergunta
 
  answers.forEach((btn, i) => {                                   // passa por todas as alternativas
    btn.textContent = q.opcoes[i];                               // coloca o texto da alternativa
    btn.dataset.index = i;                                      // guarda o número da alternativa no botão
  });
 
  timeLeft = timePerQuestion;                                 // reseta tempo
  timeLeftEl.textContent = timeLeft;                         // mostra o tempo na tela
 
  nextBtn.disabled = true;                                  // desativa o botão próxima
  startTimer();                                            // inicia o timer
}
 
// função que cria o cronômetro da pergunta
function startTimer() {
  const circle = document.querySelector("#timerCircle .progress");           // pega o círculo do timer
  const total = timePerQuestion;                                            // tempo total
  let current = total;                                                     // tempo começando cheio
 
  circle.style.strokeDashoffset = 0;                                     // reseta o círculo
 
  if (timerInterval) clearInterval(timerInterval);                      // para timer anterior

  // Aqui tem um loop temporizado (repete várias vezes)
  timerInterval = setInterval(() => {                                  // cria loop a cada 1 segundo
    current--;                                                        // tira 1 segundo
    timeLeftEl.textContent = current;                                // mostra na tela
 
    const progress = (current / total) * 163;                       // calcula animação do círculo
    circle.style.strokeDashoffset = 163 - progress;                // atualiza desenho
 
    if (current <= 0) {                                           // se o tempo acabou
      clearInterval(timerInterval);                              // para timer
      timerInterval = null;
 
      answers.forEach(b => b.disabled = true);                  // trava os botões
 
      const q = perguntas[perguntaIndex];                      // pega pergunta atual
      answers[q.correta].style.background = '#c8f7d0';      // mostra resposta correta
 
      nextBtn.disabled = false;                              // libera botão próxima
    }
  }, 1000);                                                 // repete a cada 1 segundo
}
 
// quando o jogador clica numa resposta
answers.forEach(btn => {
  btn.addEventListener('click', () => {                   // quando clicar...
    answers.forEach(b => b.disabled = true);             // desativa todos botões
    if (timerInterval) clearInterval(timerInterval);    // para o tempo


    // outro exemplo de variável local 
    const idx = Number(btn.dataset.index);             // pega o número do botão clicado
    const q = perguntas[perguntaIndex];               // pega pergunta atual
 
    if (idx === q.correta) {                        // se a resposta é correta
      btn.style.background = '#c8f7d0';          // pinta verde
      // Aqui um exemplo de processamento
      score++;                                    // soma ponto
      scoreValueEl.textContent = score;          // mostra ponto na tela
    } 
    
    // Aqui usa estruturas condicionantes
    else {                                                        // se errou
      btn.style.background = '#ffd6d6';                        // pinta vermelho
      answers[q.correta].style.background = '#c8f7d0';        // mostra a correta
      vidas--;                                                 // perde uma vida
      atualizarVidas();                                       // atualiza corações
 
      if (vidas <= 0) {                                      // acabou vidas?
        setTimeout(() => {                                  // espera 0.5s
          gameScreen.classList.add('hidden');              // esconde jogo
          const gameOver = document.getElementById('gameOverScreen'); 
          gameOver.classList.remove('hidden');                         // mostra Game Over
 
          gameMusic.pause();                           // para música
          gameMusic.currentTime = 0;                  // volta ao começo
        }, 500);
        return;                                      // sai da função
      }
    }
 
    nextBtn.disabled = false;                      // libera botão próxima
  });
});
 
// botão próxima pergunta
nextBtn.addEventListener('click', () => {
  perguntaIndex++;                                                       // vai para a próxima pergunta
 
  if (perguntaIndex >= perguntas.length) {                              // se acabou as perguntas
    gameScreen.classList.add('hidden');                                // esconde área do jogo
 
    const winScreen = document.getElementById('winScreen');

// Aqui um exemplo de saída (Output) 
    winScreen.classList.remove('hidden');                            // mostra tela de vitória
    document.getElementById('finalScore').textContent = score;      // mostra pontos finais
 
    gameMusic.pause();                                              // para música
    gameMusic.currentTime = 0;                                     // volta a música para o início (zera o tempo)  
    return;                                                       // sair
  }
 
  showQuestion();                                                 // mostra próxima pergunta
});
 
// Botão "Iniciar"
// Aqui é um exemplo de entrada (Input)
startBtn.addEventListener('click', startGame);                  // Quando clicar no botão iniciar, chama a função startGame()

// Botão "Encerrar"
endBtn.addEventListener('click', () => {
  location.reload();                                           // Recarrega a página (volta ao começo)
  gameMusic.pause();                                          // Pausa a música
  gameMusic.currentTime = 0;                                 // Zera a música
});

// Botão "Recomeçar" da tela de Game Over
document.getElementById('restartBtn').addEventListener('click', () => {
  location.reload();                                      // Recarrega tudo e reinicia o jogo
  gameMusic.pause();                                     // Pausa a música
  gameMusic.currentTime = 0;                            // Zera o tempo da música
});

// Botão "Recomeçar" da tela de Vitória
document.getElementById('restartWinBtn').addEventListener('click', () => {
  location.reload();                                     // Reinicia o jogo do zero
  gameMusic.pause();                                    // Pausa a música
  gameMusic.currentTime = 0;                           // Volta a música para o início
});
