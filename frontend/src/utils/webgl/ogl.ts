export class Vec3 extends Array<number> {
  constructor(x = 0, y = x, z = x) {
    super(3);
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }
  get x() { return this[0]; }
  get y() { return this[1]; }
  get z() { return this[2]; }
  set x(val) { this[0] = val; }
  set y(val) { this[1] = val; }
  set z(val) { this[2] = val; }

  set(x: number, y = x, z = x) {
    this[0] = x; this[1] = y; this[2] = z;
    return this;
  }
  copy(v: Vec3 | number[]) {
    this[0] = v[0]; this[1] = v[1]; this[2] = v[2];
    return this;
  }
  add(a: Vec3, b?: Vec3) {
    if (b) {
      this[0] = a[0] + b[0];
      this[1] = a[1] + b[1];
      this[2] = a[2] + b[2];
    } else {
      this[0] += a[0];
      this[1] += a[1];
      this[2] += a[2];
    }
    return this;
  }
  sub(a: Vec3, b?: Vec3) {
    if (b) {
      this[0] = a[0] - b[0];
      this[1] = a[1] - b[1];
      this[2] = a[2] - b[2];
    } else {
      this[0] -= a[0];
      this[1] -= a[1];
      this[2] -= a[2];
    }
    return this;
  }
  multiply(v: number) {
    this[0] *= v; this[1] *= v; this[2] *= v;
    return this;
  }
  divide(v: number) {
    this[0] /= v; this[1] /= v; this[2] /= v;
    return this;
  }
  len() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
  }
  distance(v?: Vec3) {
    if (v) {
      const dx = this[0] - v[0];
      const dy = this[1] - v[1];
      const dz = this[2] - v[2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    return this.len();
  }
  squaredDistance(v: Vec3) {
    const dx = this[0] - v[0];
    const dy = this[1] - v[1];
    const dz = this[2] - v[2];
    return dx * dx + dy * dy + dz * dz;
  }
  normalize() {
    const len = this.len();
    if (len > 0) this.multiply(1 / len);
    return this;
  }
  dot(v: Vec3) {
    return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
  }
  cross(a: Vec3, b?: Vec3) {
    const ax = a[0], ay = a[1], az = a[2];
    const bx = b ? b[0] : this[0];
    const by = b ? b[1] : this[1];
    const bz = b ? b[2] : this[2];
    this[0] = ay * bz - az * by;
    this[1] = az * bx - ax * bz;
    this[2] = ax * by - ay * bx;
    return this;
  }
  applyMatrix4(m: Mat4) {
    const x = this[0], y = this[1], z = this[2];
    const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    this[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    this[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    this[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return this;
  }
  applyQuaternion(q: number[]) {
    const x = this[0], y = this[1], z = this[2];
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  fromArray(arr: number[] | Float32Array, offset = 0) {
    this[0] = arr[offset];
    this[1] = arr[offset + 1];
    this[2] = arr[offset + 2];
    return this;
  }
}

export class Mat4 extends Array<number> {
  constructor() {
    super(16);
    this.identity();
  }
  identity() {
    this[0] = 1; this[1] = 0; this[2] = 0; this[3] = 0;
    this[4] = 0; this[5] = 1; this[6] = 0; this[7] = 0;
    this[8] = 0; this[9] = 0; this[10] = 1; this[11] = 0;
    this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 1;
    return this;
  }
  copy(m: Mat4 | number[]) {
    for (let i = 0; i < 16; i++) this[i] = m[i];
    return this;
  }
  multiply(a: Mat4, b: Mat4) {
    const ae = a, be = b;
    const te = this;
    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }
  fromPerspective({ fov, aspect, near, far }: { fov: number; aspect: number; near: number; far: number }) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    this[0] = f / aspect; this[1] = 0; this[2] = 0; this[3] = 0;
    this[4] = 0; this[5] = f; this[6] = 0; this[7] = 0;
    this[8] = 0; this[9] = 0; this[10] = (far + near) * nf; this[11] = -1;
    this[12] = 0; this[13] = 0; this[14] = (2 * far * near) * nf; this[15] = 0;
    return this;
  }
  fromOrthogonal({ left, right, bottom, top, near, far }: { left: number; right: number; bottom: number; top: number; near: number; far: number }) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    this[0] = -2 * lr; this[1] = 0; this[2] = 0; this[3] = 0;
    this[4] = 0; this[5] = -2 * bt; this[6] = 0; this[7] = 0;
    this[8] = 0; this[9] = 0; this[10] = 2 * nf; this[11] = 0;
    this[12] = (left + right) * lr; this[13] = (top + bottom) * bt; this[14] = (far + near) * nf; this[15] = 1;
    return this;
  }
  inverse(m = this) {
    const n11 = m[0], n12 = m[4], n13 = m[8], n14 = m[12];
    const n21 = m[1], n22 = m[5], n23 = m[9], n24 = m[13];
    const n31 = m[2], n32 = m[6], n33 = m[10], n34 = m[14];
    const n41 = m[3], n42 = m[7], n43 = m[11], n44 = m[15];

    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (det === 0) return this.identity();
    const idet = 1 / det;

    this[0] = t11 * idet;
    this[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * idet;
    this[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * idet;
    this[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * idet;

    this[4] = t12 * idet;
    this[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * idet;
    this[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * idet;
    this[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * idet;

    this[8] = t13 * idet;
    this[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * idet;
    this[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * idet;
    this[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * idet;

    this[12] = t14 * idet;
    this[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * idet;
    this[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * idet;
    this[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * idet;

    return this;
  }
  fromQuaternion(q: number[]) {
    const x = q[0], y = q[1], z = q[2], w = q[3];
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    this[0] = 1 - (yy + zz); this[1] = xy + wz; this[2] = xz - wy; this[3] = 0;
    this[4] = xy - wz; this[5] = 1 - (xx + zz); this[6] = yz + wx; this[7] = 0;
    this[8] = xz + wy; this[9] = yz - wx; this[10] = 1 - (xx + yy); this[11] = 0;
    this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 1;
    return this;
  }
  getTranslation(v: Vec3) {
    v[0] = this[12];
    v[1] = this[13];
    v[2] = this[14];
    return this;
  }
  getMaxScaleOnAxis() {
    const x = this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
    const y = this[4] * this[4] + this[5] * this[5] + this[6] * this[6];
    const z = this[8] * this[8] + this[9] * this[9] + this[10] * this[10];
    return Math.sqrt(Math.max(x, y, z));
  }
}

export class Transform {
  parent: Transform | null = null;
  children: Transform[] = [];
  visible = true;
  matrix = new Mat4();
  worldMatrix = new Mat4();
  matrixAutoUpdate = true;
  worldMatrixNeedsUpdate = false;
  position = new Vec3();
  scale = new Vec3(1);
  rotation = new Vec3();
  quaternion = [0, 0, 0, 1];

  setParent(parent: Transform | null) {
    if (this.parent) {
      const idx = this.parent.children.indexOf(this);
      if (idx >= 0) this.parent.children.splice(idx, 1);
    }
    this.parent = parent;
    if (parent && !parent.children.includes(this)) parent.children.push(this);
  }
  addChild(child: Transform) {
    child.setParent(this);
  }
  removeChild(child: Transform) {
    child.setParent(null);
  }
  updateMatrix() {
    const x = this.rotation[0], y = this.rotation[1], z = this.rotation[2];
    const c1 = Math.cos(x / 2), s1 = Math.sin(x / 2);
    const c2 = Math.cos(y / 2), s2 = Math.sin(y / 2);
    const c3 = Math.cos(z / 2), s3 = Math.sin(z / 2);
    this.quaternion[0] = s1 * c2 * c3 + c1 * s2 * s3;
    this.quaternion[1] = c1 * s2 * c3 - s1 * c2 * s3;
    this.quaternion[2] = c1 * c2 * s3 - s1 * s2 * c3;
    this.quaternion[3] = c1 * c2 * c3 + s1 * s2 * s3;

    const q = this.quaternion;
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
    const xx = qx * x2, xy = qx * y2, xz = qx * z2;
    const yy = qy * y2, yz = qy * z2, zz = qz * z2;
    const wx = qw * x2, wy = qw * y2, wz = qw * z2;
    const sx = this.scale[0], sy = this.scale[1], sz = this.scale[2];

    this.matrix[0] = (1 - (yy + zz)) * sx;
    this.matrix[1] = (xy + wz) * sx;
    this.matrix[2] = (xz - wy) * sx;
    this.matrix[3] = 0;

    this.matrix[4] = (xy - wz) * sy;
    this.matrix[5] = (1 - (xx + zz)) * sy;
    this.matrix[6] = (yz + wx) * sy;
    this.matrix[7] = 0;

    this.matrix[8] = (xz + wy) * sz;
    this.matrix[9] = (yz - wx) * sz;
    this.matrix[10] = (1 - (xx + yy)) * sz;
    this.matrix[11] = 0;

    this.matrix[12] = this.position[0];
    this.matrix[13] = this.position[1];
    this.matrix[14] = this.position[2];
    this.matrix[15] = 1;

    this.worldMatrixNeedsUpdate = true;
  }
  updateMatrixWorld(force?: boolean) {
    if (this.matrixAutoUpdate) this.updateMatrix();
    if (this.worldMatrixNeedsUpdate || force) {
      if (!this.parent) {
        this.worldMatrix.copy(this.matrix);
      } else {
        this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
      }
      this.worldMatrixNeedsUpdate = false;
      force = true;
    }
    for (const child of this.children) {
      child.updateMatrixWorld(force);
    }
  }
  traverse(callback: (node: Transform) => void | boolean) {
    if (callback(this)) return;
    for (const child of this.children) {
      child.traverse(callback);
    }
  }
}

export class Camera extends Transform {
  projectionMatrix = new Mat4();
  viewMatrix = new Mat4();
  projectionViewMatrix = new Mat4();
  worldPosition = new Vec3();
  fov: number;
  near: number;
  far: number;
  aspect: number;
  type = 'perspective';
  constructor(_gl: any, { fov = 35, near = 0.1, far = 100, aspect = 1 } = {}) {
    super();
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;
    this.perspective();
  }
  perspective({ fov = this.fov, aspect = this.aspect, near = this.near, far = this.far } = {}) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projectionMatrix.fromPerspective({ fov: (fov * Math.PI) / 180, aspect, near, far });
    return this;
  }
  updateMatrixWorld(force?: boolean) {
    super.updateMatrixWorld(force);
    this.viewMatrix.inverse(this.worldMatrix);
    this.worldMatrix.getTranslation(this.worldPosition);
    this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
    return this;
  }
  project(v: Vec3) {
    v.applyMatrix4(this.viewMatrix);
    v.applyMatrix4(this.projectionMatrix);
    return this;
  }
}

export class Geometry {
  gl: any;
  attributes: any;
  id: number;
  drawRange = { start: 0, count: 0 };
  static idCount = 0;
  constructor(gl: any, attributes: any = {}) {
    this.gl = gl;
    this.attributes = attributes;
    this.id = Geometry.idCount++;
    for (const key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }
  addAttribute(key: string, attr: any) {
    attr.size = attr.size || 1;
    attr.type = attr.type || (attr.data instanceof Float32Array ? this.gl.FLOAT : this.gl.UNSIGNED_SHORT);
    attr.target = key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
    attr.usage = attr.usage || this.gl.STATIC_DRAW;
    if (!attr.buffer) {
      attr.buffer = this.gl.createBuffer();
      this.updateAttribute(attr);
    }
    if (key === 'index') {
      this.drawRange.count = attr.data.length;
    } else if (!this.attributes.index) {
      this.drawRange.count = Math.max(this.drawRange.count, attr.data.length / attr.size);
    }
  }
  updateAttribute(attr: any) {
    this.gl.bindBuffer(attr.target, attr.buffer);
    this.gl.bufferData(attr.target, attr.data, attr.usage);
  }
  draw({ program, mode = this.gl.TRIANGLES }: { program: any; mode?: number }) {
    program.attributeLocations.forEach((loc: number, name: string) => {
      const attr = this.attributes[name];
      if (!attr) return;
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.gl.enableVertexAttribArray(loc);
      this.gl.vertexAttribPointer(loc, attr.size, attr.type, false, 0, 0);
    });
    if (this.attributes.index) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
      this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, 0);
    } else {
      this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
    }
  }
  remove() {
    for (const key in this.attributes) {
      this.gl.deleteBuffer(this.attributes[key].buffer);
    }
  }
}

export class Program {
  gl: any;
  id: number;
  uniforms: any;
  program: any;
  vertexShader: any;
  fragmentShader: any;
  attributeLocations = new Map<string, number>();
  transparent: boolean;
  static idCount = 0;
  constructor(gl: any, { vertex, fragment, uniforms = {}, transparent = false }: { vertex: string; fragment: string; uniforms?: any; transparent?: boolean }) {
    this.gl = gl;
    this.id = Program.idCount++;
    this.uniforms = uniforms;
    this.transparent = transparent;

    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertex);
    gl.compileShader(this.vertexShader);
    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(this.vertexShader));
    }

    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragment);
    gl.compileShader(this.fragmentShader);
    if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(this.fragmentShader));
    }

    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }

    const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; i++) {
      const info = gl.getActiveAttrib(this.program, i);
      if (!info) continue;
      const loc = gl.getAttribLocation(this.program, info.name);
      this.attributeLocations.set(info.name, loc);
    }
  }
  use() {
    this.gl.useProgram(this.program);
    if (this.transparent) {
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    } else {
      this.gl.disable(this.gl.BLEND);
    }
    let textureUnit = 0;
    for (const name in this.uniforms) {
      const u = this.uniforms[name];
      const loc = this.gl.getUniformLocation(this.program, name);
      if (!loc) continue;
      const val = u.value;
      if (val && val.texture) {
        if (val.needsUpdate) {
          val.update();
          val.needsUpdate = false;
        }
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, val.texture);
        this.gl.uniform1i(loc, textureUnit);
        textureUnit++;
      } else if (Array.isArray(val) || val instanceof Float32Array) {
        if (val.length === 2) this.gl.uniform2fv(loc, val);
        else if (val.length === 3) this.gl.uniform3fv(loc, val);
        else if (val.length === 4) this.gl.uniform4fv(loc, val);
        else if (val.length === 16) this.gl.uniformMatrix4fv(loc, false, val);
        else this.gl.uniform1fv(loc, val);
      } else if (typeof val === 'number') {
        this.gl.uniform1f(loc, val);
      } else if (typeof val === 'boolean') {
        this.gl.uniform1i(loc, val ? 1 : 0);
      }
    }
  }
  remove() {
    this.gl.deleteProgram(this.program);
    this.gl.deleteShader(this.vertexShader);
    this.gl.deleteShader(this.fragmentShader);
  }
}

export class Mesh extends Transform {
  gl: any;
  geometry: Geometry;
  program: Program;
  mode: number;
  renderOrder = 0;
  constructor(gl: any, { geometry, program, mode = gl.TRIANGLES }: { geometry: Geometry; program: Program; mode?: number }) {
    super();
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;
    this.mode = mode;
  }
  draw({ camera }: { camera?: any } = {}) {
    if (camera) {
      if (!this.program.uniforms.modelMatrix) this.program.uniforms.modelMatrix = { value: null };
      this.program.uniforms.modelMatrix.value = this.worldMatrix;
      
      if (!this.program.uniforms.viewMatrix) this.program.uniforms.viewMatrix = { value: null };
      this.program.uniforms.viewMatrix.value = camera.viewMatrix;
      
      if (!this.program.uniforms.projectionMatrix) this.program.uniforms.projectionMatrix = { value: null };
      this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
      
      if (!this.program.uniforms.modelViewMatrix) this.program.uniforms.modelViewMatrix = { value: null };
      const mv = new Mat4();
      mv.multiply(camera.viewMatrix, this.worldMatrix);
      this.program.uniforms.modelViewMatrix.value = mv;
    }
    this.program.use();
    this.geometry.draw({ program: this.program, mode: this.mode });
  }
}

export class Texture {
  gl: any;
  texture: any;
  image: any;
  width: number;
  height: number;
  minFilter: any;
  magFilter: any;
  wrapS: any;
  wrapT: any;
  needsUpdate = false;
  constructor(gl: any, { image, width = 1, height = 1, minFilter = gl.LINEAR, magFilter = gl.LINEAR, wrapS = gl.CLAMP_TO_EDGE, wrapT = gl.CLAMP_TO_EDGE }: { image?: any; width?: number; height?: number; minFilter?: any; magFilter?: any; wrapS?: any; wrapT?: any } = {}) {
    this.gl = gl;
    this.texture = gl.createTexture();
    this.image = image;
    this.width = width;
    this.height = height;
    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
    this.update();
  }
  update(minFilter = this.minFilter, magFilter = this.magFilter, wrapS = this.wrapS, wrapT = this.wrapT) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, minFilter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, magFilter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapS);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapT);
    
    if (this.image) {
      if (this.image instanceof Uint8Array) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
      } else {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
      }
      if (minFilter === this.gl.LINEAR_MIPMAP_LINEAR || 
          minFilter === this.gl.NEAREST_MIPMAP_NEAREST || 
          minFilter === this.gl.LINEAR_MIPMAP_NEAREST || 
          minFilter === this.gl.NEAREST_MIPMAP_LINEAR) {
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
      }
    } else {
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    }
  }
}

export class Plane extends Geometry {
  constructor(gl: any, { width = 1, height = 1, widthSegments = 1, heightSegments = 1 } = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const numVerts = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6;
    
    const position = new Float32Array(numVerts * 3);
    const uv = new Float32Array(numVerts * 2);
    const index = new Uint16Array(numIndices);
    
    let p = 0;
    for (let y = 0; y <= hSegs; y++) {
      const yRatio = y / hSegs;
      const yPos = yRatio * height - height / 2;
      for (let x = 0; x <= wSegs; x++) {
        const xRatio = x / wSegs;
        const xPos = xRatio * width - width / 2;
        
        position[p * 3] = xPos;
        position[p * 3 + 1] = -yPos;
        position[p * 3 + 2] = 0;
        
        uv[p * 2] = xRatio;
        uv[p * 2 + 1] = yRatio;
        
        p++;
      }
    }
    
    let iIdx = 0;
    for (let y = 0; y < hSegs; y++) {
      for (let x = 0; x < wSegs; x++) {
        const a = y * (wSegs + 1) + x;
        const b = y * (wSegs + 1) + x + 1;
        const c = (y + 1) * (wSegs + 1) + x;
        const d = (y + 1) * (wSegs + 1) + x + 1;
        
        index[iIdx++] = a;
        index[iIdx++] = c;
        index[iIdx++] = b;
        
        index[iIdx++] = b;
        index[iIdx++] = c;
        index[iIdx++] = d;
      }
    }
    
    super(gl, {
      position: { size: 3, data: position },
      uv: { size: 2, data: uv },
      index: { data: index }
    });
  }
}

export class Triangle extends Geometry {
  constructor(gl: any) {
    super(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
    });
  }
}

export class Renderer {
  dpr: number;
  gl: any;
  width = 0;
  height = 0;
  isWebgl2 = false;
  constructor({ canvas = document.createElement('canvas'), width = 300, height = 150, dpr = 1, alpha = false, antialias = false } = {}) {
    this.dpr = dpr;
    const opts = { alpha, antialias, depth: true, stencil: false };
    let gl = canvas.getContext('webgl2', opts);
    if (gl) {
      this.isWebgl2 = true;
    } else {
      gl = canvas.getContext('webgl', opts);
    }
    if (!gl) console.error('Unable to create WebGL context');
    this.gl = gl;
    this.gl.renderer = this;
    this.setSize(width, height);
  }
  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.gl.canvas.width = width * this.dpr;
    this.gl.canvas.height = height * this.dpr;
    if ((this.gl.canvas as HTMLCanvasElement).style) {
      Object.assign((this.gl.canvas as HTMLCanvasElement).style, {
        width: `${width}px`,
        height: `${height}px`
      });
    }
  }
  setViewport(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
  }
  bindFramebuffer(target?: any) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target ? target.buffer : null);
  }
  render({ scene, camera, target = null, clear = true }: { scene: any; camera?: any; target?: any; clear?: boolean }) {
    if (!target) {
      this.bindFramebuffer();
      this.setViewport(this.width * this.dpr, this.height * this.dpr);
    } else {
      this.bindFramebuffer(target);
      this.setViewport(target.width, target.height);
    }
    if (clear) {
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    
    scene.updateMatrixWorld();
    if (camera) camera.updateMatrixWorld();
    
    const meshes: any[] = [];
    scene.traverse((node: any) => {
      if (!node.visible) return true;
      if (node.draw) meshes.push(node);
    });
    
    meshes.sort((a, b) => {
      const orderA = a.renderOrder ?? 0;
      const orderB = b.renderOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return (a.position[2] - b.position[2]);
    });
    
    for (const mesh of meshes) {
      mesh.draw({ camera });
    }
  }
}

export class RenderTarget {
  gl: any;
  width: number;
  height: number;
  buffer: any;
  texture: Texture;
  constructor(gl: any, { width = gl.canvas.width, height = gl.canvas.height } = {}) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.buffer = gl.createFramebuffer();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    
    this.texture = new Texture(gl, {
      width,
      height,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    });
    
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.texture.width = width;
    this.texture.height = height;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
  }
}
