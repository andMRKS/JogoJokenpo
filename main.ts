import 'zone.js';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      /* --- FONTES E ESTILOS GLOBAIS --- */
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

      :host {
        --bg-color: #1a1a2e;
        --primary-color: #16213e;
        --secondary-color: #0f3460;
        --accent-color: #e94560;
        --text-color: #e0e0e0;
        --font-family: 'Poppins', sans-serif;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: var(--font-family);
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
      }

      main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      /* --- CABEÇALHO E RODAPÉ --- */
      header h1 {
        font-size: 2.5rem;
        color: var(--accent-color);
        font-weight: 700;
        margin-bottom: 20px;
      }

      footer {
        padding-top: 20px;
        font-size: 0.9rem;
        opacity: 0.6;
      }

      /* --- PLACAR --- */
      .score-board {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        background: var(--primary-color);
        padding: 10px 30px;
        border-radius: 15px;
        border: 2px solid var(--secondary-color);
        margin-bottom: 40px;
      }
      .score-box {
        font-size: 1.5rem;
        font-weight: 600;
      }
      .score-box span {
        display: block;
        font-size: 2.5rem;
        color: var(--accent-color);
      }

      /* --- TELA DE JOGO --- */
      .game-view h2 {
        font-size: 1.8rem;
        font-weight: 400;
        margin-bottom: 30px;
      }
      .choice-buttons {
        display: flex;
        gap: 30px;
      }
      .choice-button {
        font-size: 5rem;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 5px solid var(--secondary-color);
        background: var(--primary-color);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .choice-button:hover {
        transform: translateY(-10px) scale(1.1);
        border-color: var(--accent-color);
        box-shadow: 0 10px 20px rgba(233, 69, 96, 0.2);
      }

      /* --- TELA DE RESULTADO --- */
      .result-view h2 { font-size: 3rem; font-weight: 700; margin-bottom: 30px; }
      .result-view .win { color: #4dff91; }
      .result-view .lose { color: #ff4d6d; }
      .result-view .draw { color: #a9a9a9; }
      
      .result-choices { display: flex; justify-content: center; gap: 50px; margin-bottom: 40px; }
      .choice-card {
        background: var(--primary-color);
        padding: 30px;
        border-radius: 20px;
        border: 4px solid var(--secondary-color);
        transition: all 0.3s ease;
      }
      .choice-card h3 { font-size: 1.5rem; margin-bottom: 15px; }
      .choice-card .emoji { font-size: 6rem; line-height: 1; }
      
      .result-actions { display: flex; gap: 20px; }
      .action-button {
        padding: 15px 30px;
        font-size: 1.1rem;
        font-weight: 600;
        font-family: var(--font-family);
        cursor: pointer;
        border: none;
        border-radius: 10px;
        background-color: var(--accent-color);
        color: white;
        transition: all 0.2s ease;
      }
      .action-button:hover { transform: scale(1.05); filter: brightness(1.1); }
      .reset-button { background-color: var(--secondary-color); }

      /* --- ANIMAÇÕES --- */
      .view-container {
        animation: fadeIn 0.5s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .choice-card.winner {
        border-color: #4dff91;
        box-shadow: 0 0 30px rgba(77, 255, 145, 0.4);
        transform: scale(1.1);
        animation: breathing 2s infinite;
      }
      @keyframes breathing {
        0% { transform: scale(1.1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1.1); }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <header>
        <h1>Jokenpô Moderno</h1>
      </header>
      
      <div class="score-board">
        <div class="score-box">Você <span>{{ playerScore }}</span></div>
        <div class="score-box">PC <span>{{ computerScore }}</span></div>
      </div>

      <main>
        <div *ngIf="gameState === 'GAME'" class="view-container game-view">
          <h2>Escolha sua arma!</h2>
          <div class="choice-buttons">
            <button class="choice-button" (click)="play('rock')">✊</button>
            <button class="choice-button" (click)="play('paper')">🖐️</button>
            <button class="choice-button" (click)="play('scissors')">✌️</button>
          </div>
        </div>

        <div *ngIf="gameState === 'RESULT'" class="view-container result-view">
          <h2 [ngClass]="resultClass">{{ resultMessage }}</h2>
          <div class="result-choices">
            <div class="choice-card" [ngClass]="{'winner': winner === 'PLAYER'}">
              <h3>Você</h3>
              <div class="emoji">{{ playerChoiceEmoji }}</div>
            </div>
            <div class="choice-card" [ngClass]="{'winner': winner === 'COMPUTER'}">
              <h3>Computador</h3>
              <div class="emoji">{{ computerChoiceEmoji }}</div>
            </div>
          </div>
          <div class="result-actions">
            <button (click)="resetGame()" class="action-button">Jogar Novamente</button>
            <button (click)="resetScore()" class="action-button reset-button">Resetar Placar</button>
          </div>
        </div>
      </main>

      <footer>Criado com Angular no Playground</footer>
    </div>
  `,
})
export class AppComponent {
  // Controle de estado
  gameState: 'GAME' | 'RESULT' = 'GAME';

  // Placar
  playerScore = 0;
  computerScore = 0;

  // Propriedades do resultado
  resultMessage = '';
  resultClass = '';
  winner: 'PLAYER' | 'COMPUTER' | 'DRAW' | null = null;
  playerChoiceEmoji = '';
  computerChoiceEmoji = '';

  private readonly choices: { [key: string]: string } = {
    rock: '✊',
    paper: '🖐️',
    scissors: '✌️',
  };
  private readonly choiceKeys = Object.keys(this.choices);

  play(playerChoiceKey: string): void {
    const computerChoiceKey = this.choiceKeys[Math.floor(Math.random() * this.choiceKeys.length)];

    this.playerChoiceEmoji = this.choices[playerChoiceKey];
    this.computerChoiceEmoji = this.choices[computerChoiceKey];

    if (playerChoiceKey === computerChoiceKey) {
      this.resultMessage = 'Empate!';
      this.resultClass = 'draw';
      this.winner = 'DRAW';
    } else if (
      (playerChoiceKey === 'rock' && computerChoiceKey === 'scissors') ||
      (playerChoiceKey === 'paper' && computerChoiceKey === 'rock') ||
      (playerChoiceKey === 'scissors' && computerChoiceKey === 'paper')
    ) {
      this.resultMessage = 'Você Venceu!';
      this.resultClass = 'win';
      this.winner = 'PLAYER';
      this.playerScore++;
    } else {
      this.resultMessage = 'Você Perdeu!';
      this.resultClass = 'lose';
      this.winner = 'COMPUTER';
      this.computerScore++;
    }

    this.gameState = 'RESULT';
  }

  resetGame(): void {
    this.gameState = 'GAME';
    this.winner = null; // Limpa o destaque do vencedor
  }

  resetScore(): void {
    this.playerScore = 0;
    this.computerScore = 0;
    this.resetGame(); // Volta para a tela de jogo
  }
}

bootstrapApplication(AppComponent);
