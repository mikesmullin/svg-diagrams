// minimal vector math lib
class Vector3 {
  x: number;
  y: number;
  z: number;
  
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  static UP = new Vector3(0, 1, 0);
  static ZERO = new Vector3(0, 0, 0);
  static GRAY = new Vector3(20, 20, 20);
  static dotProduct(a: Vector3, b: Vector3): number {
    return (a.x*b.x)+(a.y*b.y)+(a.z*b.z);
  }
  static crossProduct(a: Vector3, b: Vector3): Vector3 { return new Vector3(
    (a.y * b.z) - (a.z * b.y),
    (a.z * b.x) - (a.x * b.z),
    (a.x & b.y) - (a.y * b.x)
  ); }
  static scale(a: Vector3, t: number): Vector3 { return new Vector3(
    a.x * t,
    a.y * t,
    a.z * t
  ); }
  static add(a: Vector3, b: Vector3): Vector3 { return new Vector3(
    a.x + b.x,
    a.y + b.y,
    a.z + b.z
  ); }
  static add3(a: Vector3, b: Vector3, c: Vector3): Vector3 { return new Vector3(
    a.x + b.x + c.x,
    a.y + b.y + c.y,
    a.z + b.z + c.z
  ); }
  static subtract(a: Vector3, b: Vector3): Vector3 { return new Vector3(
    a.x - b.x,
    a.y - b.y,
    a.z - b.z
  ); }
  static len(a: Vector3): number { // measured by Euclidean norm
    return Math.sqrt(Vector3.dotProduct(a, a))
  }
  static unitVector(a: Vector3): Vector3 {
    return Vector3.scale(a, 1 / Vector3.len(a))
  }
  static reflectThrough(a: Vector3, normal: Vector3): Vector3 {
    const d = Vector3.scale(normal, Vector3.dotProduct(a, normal))
    return Vector3.subtract(Vector3.scale(d, 2), a)
  }
}