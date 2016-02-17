class Language {
	constructor(name, counter) {
		this.name = name
		this.counter = counter
	}

	toString() {
		return `${this.name}: ${this.counter}`
	}
}

module.exports = Language