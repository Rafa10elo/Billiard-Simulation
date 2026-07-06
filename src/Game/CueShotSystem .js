import { Vector3 } from '../Physics/Math/Vector3.js';
    

export class CueShotSystem {


    strike(cueBall, { angleX, angely ,angleZ, power, offsetX = 0, offsetY = 0 }) {
        const direction = new Vector3(angleX, angely, angleZ).normalize();
        const impulse = direction.multiplyScalar(power);

        const hitPoint = new Vector3(offsetX, offsetY, 0);
        cueBall.applyImpulseAtPoint(impulse,hitPoint);
    }
}