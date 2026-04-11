class TCPStream {
  private initialized = false;
  private nextExpectedSeq: number = 0;
  private buffer: Map<number, Uint8Array> = new Map();
  private reassembled: Uint8Array[] = [];

  initialize(initialSeq: number) {
    this.initialized = true;
    this.nextExpectedSeq = initialSeq;
  }

  ingest(seq: number, data: Uint8Array) {
    if(data.length === 0) return;

    if(!this.initialized) {
      this.initialize(seq);
    }

    // case one: the thingamajig is in order, just push it to array
    if(seq === this.nextExpectedSeq) {
      this.reassembled.push(data);
      this.nextExpectedSeq += data.length;
      this.drain();

    } else if(seq > this.nextExpectedSeq) {
      // case two: out of order, received in advanced so just gonn store it
      this.buffer.set(seq, data);

    } else if(seq < this.nextExpectedSeq) {
      // case three: retransmitted, received twice
      
      // case 3.1 lmao: full retransmitt
      const segEnd = seq + data.length;
      if(segEnd <= this.nextExpectedSeq) return;

      // case 3.2: partial retransmit, some data
      const newData = data.subarray(this.nextExpectedSeq - seq);
      this.reassembled.push(newData);
      this.nextExpectedSeq += newData.length;
      this.drain();
    }
  }

  drain() {
    while (this.buffer.has(this.nextExpectedSeq)) {
      let data = this.buffer.get(this.nextExpectedSeq)!;
      this.reassembled.push(data);
      this.buffer.delete(this.nextExpectedSeq);
      this.nextExpectedSeq += data.length;
    }
  }

  getReassembled(): Uint8Array {
    const total = this.reassembled.reduce((a,b) => a + b.length, 0);
    const out = new Uint8Array(total);

    let offset = 0;
    for(const bigchungus of this.reassembled) {
      out.set(bigchungus, offset);
      offset += bigchungus.length;
    }

    return out;
  }
}

export {TCPStream};