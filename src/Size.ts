export class Size {
  static prefixes = ["", "Ki", "Mi", "Gi"];

  constructor(readonly bytes: number) {}

  toString() {
    for (let i = Size.prefixes.length - 1; i >= 0; i--) {
      const prefix = Size.prefixes[i];
      const unit = 1024 ** i;
      const value = this.bytes / unit;
      if (value < 1) continue;
      return value.toFixed(1) + prefix + "B";
    }
    return "";
  }
}
