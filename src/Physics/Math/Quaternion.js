export class Quaternion {

	constructor(x = 0, y = 0, z = 0, w = 1) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	set(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	copy(q) {
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
		return this;
	}

	clone() {
		return new Quaternion(this.x, this.y, this.z, this.w);
	}

	normalize() {
		const length = Math.sqrt(
			this.x * this.x +
			this.y * this.y +
			this.z * this.z +
			this.w * this.w
		);

		if (length === 0) {
			this.w = 1;
			return this;
		}

		const inverseLength = 1 / length;
		this.x *= inverseLength;
		this.y *= inverseLength;
		this.z *= inverseLength;
		this.w *= inverseLength;
		return this;
	}

	multiply(q) {
		const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
		const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
		const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
		const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	toObject() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
			w: this.w
		};
	}

}
