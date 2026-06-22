import { BallData } from '../../Data/BallData.js';
import { BallBody } from '../../Physics/Bodies/BallBody.js';

export class BallFactory {

	static createBallBodies(data = BallData) {
		return data.map((ballData) => new BallBody(ballData));
	}

}

