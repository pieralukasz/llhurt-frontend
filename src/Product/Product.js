export default class {
  constructor(name, category) {
    this.name = name;
    this.details = []
    this.category = category
  }

  addDetails(color, photo, size) {
    this.details.push({
      category: this.category,
      name: this.name,
      color,
      photo,
      product: [size]
    })
  }
}