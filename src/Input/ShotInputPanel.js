export class ShotInputPanel {

    constructor(container, onSubmit) {
        this.onSubmit = onSubmit;
        this.limits = {
            power: { min: 0, max: 5 },
            directionX: { min: -1, max: 1 },
            angely: { min: -1, max: 1 },
            directionZ: { min: -1, max: 1 },
            hitOffsetMax: 0.032 // 0.8 * radius (0.04)
        };

        container.innerHTML = `
            <form id="shot-form">
                <label>Direction X: <input type="number" id="dirX" step="0.01" min="-1" max="1" value="0.8"></label>
                <label>Direction Y: <input type="number" id="dirY" step="0.01" min="-1" max="1" value="0.0"></label>
                <label>Direction Z: <input type="number" id="dirZ" step="0.01" min="-1" max="1" value="0.45"></label>
                <label>Power: <input type="number" id="power" step="0.01" min="0" max="5" value="1"></label>
                <label>Hit Offset X: <input type="number" id="offX" step="0.001" min="-0.032" max="0.032" value="0"></label>
                <label>Hit Offset Y: <input type="number" id="offY" step="0.001" min="-0.032" max="0.032" value="0"></label>
                <button type="submit">Strike</button>
                <p id="shot-error" style="color:red;"></p>
            </form>
        `;

        container.querySelector('#shot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const get = (id) => parseFloat(document.getElementById(id).value);

        const params = {
            angleX: get('dirX'),
            angely: get('dirY'),
            angleZ: get('dirZ'),
            power: get('power'),
            offsetX: get('offX'),
            offsetY: get('offY')
        };

        const error = this.validate(params);
        const errorEl = document.getElementById('shot-error');

        if (error) {
            errorEl.textContent = error;
            return;
        }

        errorEl.textContent = '';
        this.onSubmit(params);
    }

    validate({ power, offsetX, offsetY }) {
        const { power: p, hitOffsetMax } = this.limits;

        if (power < p.min || power > p.max) {
            return `Power must be between ${p.min} and ${p.max}`;
        }

        const offsetMagnitude = Math.sqrt(offsetX ** 2 + offsetY ** 2);
        if (offsetMagnitude > hitOffsetMax) {
            return `Hit point must be within ${hitOffsetMax} of ball center`;
        }

        return null;
    }
}