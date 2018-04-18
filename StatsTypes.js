/* Class Card
 * Dylan Everingham
 * 04/18/2018
 *
 */
class Card {
	/* Class Constructor
	 * If name is provided, uses Scryfall API to get card info.
	 * Otherwise, creates an empty card.
	 */
	constructor(name) {
		if (name === undefined) {
			this.name = "";
	 		this.cmc = -1;
		}
		else {
			// Build request URL
			var url = "https://api.scryfall.com/cards/named?exact="+name;

			// Make request to Scryfall API
			var req = new XMLHttpRequest();
			req.open("GET", url, false);
			req.send();
			var cardinfo = JSON.parse(req.responseText);
			
			// Store all card info in Card object
			this.name = cardinfo.name;
			this.cmc = cardinfo.cmc;
		}
	}
}

/* Class Deck
 * Dylan Everingham
 * 04/18/2018
 *
 */
class Deck {
	/* Constructor
	 * Sets deck parameters if supplied, otherwise
	 * uses default deck parameters and fills with empty cards
	 */
	constructor(name) {
		this.name = name;
		this.maxsize = 60;
		this.size = 0;
		this.decklist = new Map();

		this.addEmptyCard(this.maxsize);
	}

	/* Function to add cards to a deck */
	addCard(name, n) {
		/* Check size */
		if ((this.size + n) > this.maxsize) {
			errstr = "Cannot add " + str(n) + " cards because it would increase deck size past maximum of " + str(this.maxsize);
			throw errstr;
		}

		/* Check if card is already present */
		if (this.cardlist.has(name)) {
			var entry = this.cardlist.get(name);
			entry[2] += n;
			this.decklist.set("", entry);
		}
		else {
			this.decklist.set("", [new Card(), n]);
			this.size += n;
		}
	}

	/* Function to add empty cards to a deck */
	addEmptyCard(n) {
		/* Check size */
		if ((this.size + n) > this.maxsize) {
			errstr = "Cannot add " + str(n) + " cards because it would increase deck size past maximum of " + str(this.maxsize);
			throw errstr;
		}

		/* Check if card is already present */
		if (this.cardlist.has("")) {
			var entry = this.cardlist.get("");
			entry[2] += n;
			this.decklist.set("", entry);
		}
		else {
			this.decklist.set("", [new Card(), n]);
			this.size += n;
		}
	}
}