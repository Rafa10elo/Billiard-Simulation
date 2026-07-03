export class GameHUD {

    constructor(container) {

        this.root = document.createElement("div");

        Object.assign(this.root.style,{
            position:"absolute",
            top:"100px",
            left:"8px",
            padding:"8px 12px",
            background:"rgba(0,0,0,.6)",
            color:"#fff",
            fontFamily:"system-ui",
            fontSize:"13px",
            borderRadius:"6px",
            pointerEvents:"none",
            zIndex:"1000"
        });

        this.ballCount=document.createElement("div");
        this.pocketCount=document.createElement("div");
        this.running=document.createElement("div");

        this.root.append(
            this.ballCount,
            this.pocketCount,
            this.running
        );

        (container ?? document.body).appendChild(this.root);
    }

    update(state){

        this.ballCount.textContent =
            `Balls : ${state.totalBalls}`;

        this.pocketCount.textContent =
            `Pocketed : ${state.pocketedBalls}`;

        this.running.textContent =
            state.resetting
            ? "Resetting..."
            : `Running : ${state.running}`;

    }

    destroy(){

        this.root.remove();

    }

}