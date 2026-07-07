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
            <div style="max-width: 250px;height:700px; margin: 1rem auto; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 10px; font-family: sans-serif; background: #adabab; box-shadow: 0 5px 6px 5px rgba(59, 57, 57, 0.66);">
                <h3 style="margin-top: 0; color: #1e3b34; display: flex; align-items: center; gap: 8px;">
                    Shot Configuration
                </h3>
                <style>
                    #timeScale::part(thumb) {
                        background-color: #1e3b34;
                        border-color: #1e3b34;
                    }
                    #timeScale::part(thumb):hover {
                        background-color: #1e3b34;
                    }
                </style>
                <form id="shot-form" style="display: flex; flex-direction: column; gap: 0.8rem;">
                    
                    <div style="display: grid; grid-template-columns: 75px 75px 75px;; gap: 10px;">
                        <sl-input id="dirX" label="Direction X" type="number" step="0.01" min="-1" max = "1" value="0.8"></sl-input>
                        <sl-input id="dirY" label="Direction Y" type="number" step="0.01" min="-1" max = "1" value="0.0"></sl-input>
                        <sl-input id="dirZ" label="Direction Z" type="number" step="0.01" min="-1" max = "1" value="0.45"></sl-input>
                    </div>

                    <div style="display: grid; grid-template-columns: 112px 112px; gap: 20px;">
                        <sl-input id="offX" label="Offset X" type="number" step="0.001" min="-0.032" max="0.032" value="0"></sl-input>
                        <sl-input id="offY" label="Offset Y" type="number" step="0.001" min="-0.032" max="0.032" value="0"></sl-input>
                    </div>

                    <sl-input id="power" label="Power" type="number" step="0.01" min="0" max="5" value="1"></sl-input>
                    <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                        <span style="color: #1e3b34; font-size: 0.85rem; font-weight: bold;">Simulation Speed</span>
                        <sl-range id="timeScale" min="0.1" max="2.0" step="0.1" value="1.0" style="--track-color-active: #1e3b34;"></sl-range>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                            <h4 style="margin: 0; color: #1e3b34; font-size: 0.95rem;">Environment Physics</h4>
                            
                            <div style="display: grid; grid-template-columns: 112px 112px; gap: 20px;">
                                <sl-input id="const_gravity" label="Gravity" type="number" step="0.01" value="-9.81"></sl-input>
                                <sl-input id="const_mass" label="Ball Mass" type="number" step="0.01" value="0.5"></sl-input>
                            </div>

                            <div style="display: grid; grid-template-columns: 112px 112px; gap: 20px;">
                                <sl-input id="const_mu_k" label="Kinetic Fric." type="number" step="0.005" value="0.1"></sl-input>
                                <sl-input id="const_mu_r" label="Rolling Fric." type="number" step="0.005" value="0.01"></sl-input>
                            </div>

                            <div style="display: grid; grid-template-columns: 112px 112px; gap: 20px;">
                                <sl-input id="const_restitution" label="Ball Rest." type="number" step="0.01" value="0.93"></sl-input>
                                <sl-input id="const_cushion" label="Cushion Rest." type="number" step="0.01" value="0.85"></sl-input>
                            </div>
                        </div>

                    <sl-button variant="primary" type="submit" style="width: 100%;--sl-color-primary-600: #1e3b34; --sl-color-primary-500: #02796dd6; ">Strike Ball</sl-button>
                    
                    <div id="shot-error" style="color: #ef4444; font-size: 0.875rem; min-height: 1.25rem;"></div>
                </form>
            </div>
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
        const updatedPhysics = {
            gravity: get('const_gravity'),
            epsilon: 0.01,
            mass: get('const_mass'),
            mu_k: get('const_mu_k'),
            mu_r: get('const_mu_r'),
            mu_sp: 0.05,
            restitution: get('const_restitution'),
            cushionRestitution: get('const_cushion'),
            timeScale: get('timeScale')
        };

        const error = this.validate(params);
        const errorEl = document.getElementById('shot-error');

        if (error) {
            errorEl.textContent = error;
            return;
        }

        errorEl.textContent = '';
        this.onSubmit(params,updatedPhysics);
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