export class RNG {
  n_w = 123456789;
  n_z = 362436069;
  mask = 0xffffffff;

  constructor(seed) {
    this.n_w = (123456789 + seed) & this.mask;
    this.n_z = (362436069 + seed) & this.mask;
  }

  random() {
    this.n_w = (18000 * (this.n_w & 65535) + (this.n_w >> 16)) & this.mask;
    this.n_z = (36969 * (this.n_z & 65535) + (this.n_z >> 16)) & this.mask;
    let result = (this.n_w << 16) + this.n_z;
    result / 4294967296;
    return result;
  }
}
