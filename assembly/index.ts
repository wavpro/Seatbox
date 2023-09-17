// The entry file of your WebAssembly module.

type Coordinates = Array<i16> // (x, y)
type Size = Array<i16> // (width, height)

interface SeatInFile {
  id: u16;
  coordinates: Coordinates;
  size: Size;
  label: string;
}

interface SeatMapFile {
  seats: Array<SeatInFile>
}

let lastId: u16 = 0;

class Element {
  _id: u16;
  coordinates: Coordinates;
  size: Size;
  label: string;

  constructor(label: string, coordinates: Coordinates, size: Size, id: u16 = (++lastId)) {
    this.coordinates = coordinates;
    this.size = size;
    this.label = label;

    this._id = id;
  }

  render(): string {
    const x = this.coordinates[0],
          y = this.coordinates[1],
          width = this.size[0],
          height = this.size[1];

    return `<g><rect class="rectangle" id="${this._id}" x="${x}" y="${y}" width="${width}" height="${height}"/><text class="label" x="${x + width / 2}" y="${y + height / 2}">${this.label}</text></g>`;
  }
}

class Seat extends Element {
  occupied: boolean;

  constructor(label: string, coordinates: Coordinates, size: Size, occupied: boolean, id: u16 = (++lastId)) {
    super(label, coordinates, size, id);

    this.occupied = occupied;
  }

  render(): string {
    const x = this.coordinates[0],
          y = this.coordinates[1],
          width = this.size[0],
          height = this.size[1];

    return `<g><rect class="seat${this.occupied ? " occupied" : ""}" id="${this._id}" x="${x}" y="${y}" width="${width}" height="${height}"/><text class="label" x="${x + width / 2}" y="${y + height / 2}">${this.label}</text></g>`;
  }
}

class SeatMap {
  elements: Array<Element> = [];
  constructor() { }

  add(element: Element): Element {
    this.elements.push(element);

    return element;
  }

  render(): string {
    let html = "<svg height=\"100%\" width=\"100%\">"

    for (let i = 0; i < this.elements.length; i++) {
      html += this.elements[i].render()
    }

    return html + "</svg>";
  }
}

let seatmap = new SeatMap();

export function clear(): void {
  seatmap = new SeatMap();
}

export function addElement(label: string, coordinates: Coordinates, size: Size, id: u16 = (++lastId)): void {
  seatmap.add(new Element(label, coordinates, size, id));
}

export function addSeat(label: string, coordinates: Coordinates, size: Size, occupied: boolean, id: u16 = (++lastId)): void {
  console.log(label)
  seatmap.add(new Seat(label, coordinates, size, occupied, id));
}

export function render(): string {
  return seatmap.render();
}