class BinaryReader {
  private view: DataView;
  public offset: number = 0;
  public endian: boolean = false;

  constructor(buffer: ArrayBuffer | Uint8Array) {
    if(buffer instanceof Uint8Array) {
      this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    } else {
      this.view = new DataView(buffer);
    }
  }

  get byteLength() {
    return this.view.buffer.byteLength;
  }

  seek(pos: number) {
    this.offset = pos;
  }

  skip(length: number) {
    this.offset += length;
  }

  setEndian(e: boolean) {
    this.endian = e;
  }

  readUInt8() {
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return val;
  }
  
  readUInt16() {
    const val = this.view.getUint16(this.offset);
    this.offset += 2;
    return val;
  }

  readUInt32() {
    const val = this.view.getUint32(this.offset);
    this.offset += 4;
    return val;
  }

  readBytes(length: number) {
    if(this.offset + length > this.view.byteLength) {
      throw new RangeError("out of bounds read");
    }

    const bytes = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length)

    this.offset += length;
    return bytes;
  }

  readStr(length: number) {
    const bytes = this.readBytes(length);
    return Array.from(bytes).map(b => String.fromCharCode(b)).join("")
  }

  isEOF() {
    return this.offset >= this.byteLength;
  }
}

export { BinaryReader }