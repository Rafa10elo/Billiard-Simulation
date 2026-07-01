export class GameHUD {
    constructor(container) {
        this.container = container;
        this.root = document.createElement('div');
        this.root.style.position = 'absolute';
        this.root.style.top = '8px';
        this.root.style.left = '8px';
        this.root.style.padding = '8px 12px';
        this.root.style.background = 'rgba(0,0,0,0.6)';
        this.root.style.color = '#fff';
        this.root.style.fontFamily = 'system-ui, Arial';
        this.root.style.fontSize = '13px';
        this.root.style.borderRadius = '6px';
        this.root.style.zIndex = '1000';
        this.root.style.pointerEvents = 'none';

        this.ballCountEl = document.createElement('div');
        this.inPocketEl = document.createElement('div');
        this.runningEl = document.createElement('div');

        this.root.appendChild(this.ballCountEl);
        this.root.appendChild(this.inPocketEl);
        this.root.appendChild(this.runningEl);

        (this.container || document.body).appendChild(this.root);
    }

    update(state){

    this.ballCountEl.textContent =
        `Balls: ${state.totalBalls}`;

    this.inPocketEl.textContent =
        `Pocketed: ${state.pocketedBalls}`;

    this.runningEl.textContent =
        state.resetting
        ? "Resetting..."
        : `Running: ${state.running}`;

}

    destroy() {
        if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    }

}

