import { PoolGame } from './Game/PoolGame.js';

const container = document.getElementById('poolTable');
const game = new PoolGame(container);

game.start();