type Comparator<T> = (a: T, b: T) => number;

export class SortedMap<T, V> {
  private items: T[] = [];
  private values: V[] = [];

  constructor(private comparator: Comparator<T>) {}

  private binarySearch(item: T): number {
    let left = 0;
    let right = this.items.length - 1;

    while (left <= right) {
      const mid = (left + right) >> 1;
      const cmp = this.comparator(item, this.items[mid]);

      if (cmp === 0) return mid;
      if (cmp < 0) right = mid - 1;
      else left = mid + 1;
    }

    return -1;
  }

  public add(item: T, value: V): void {
    let left = 0;
    let right = this.items.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (this.comparator(item, this.items[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    this.items.splice(left, 0, item);
    this.values.splice(left, 0, value);
  }

  public remove(item: T): boolean {
    const index = this.items.findIndex((i) => this.comparator(i, item) === 0);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.values.splice(index, 1);
      return true;
    }
    return false;
  }

  public getValueByItem(item: T): V | undefined {
    const index = this.binarySearch(item);
    return index !== -1 ? this.values[index] : undefined;
  }

  public size(): number {
    return this.items.length;
  }

  public toArrayItems(): T[] {
    return [...this.items];
  }

  public toArrayValues(): V[] {
    return [...this.values];
  }

  public toJSON(): string {
    const j: any = {};
    for (let index = 0; index < this.items.length; index++) {
      j[this.items[index]] = this.values[index];
    }
    return JSON.stringify(j);
  }
}
