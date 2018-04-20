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
		if ((name === undefined) || (name === "")) {
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
		this.maxcopies = 4;
		this.size = 0;
		this.decklist = new Map();

		this.addEmptyCard(this.maxsize);
	}

	/* Function to add or remove cards from a deck 
	 * Passing a negative value for n removes cards
	 */
	addCard(name, n) {
		/* Check size */
		if ((this.size + n) > this.maxsize) {
			var numover = this.size + n - this.maxsize;

			/* If empty cards can be removed, do that */
			if (this.decklist.get("")[1] >= numover) {
				this.addCard("", -1 * numover);
			}
			n = this.maxsize - this.size;
		}
		if ((this.size + n) < 0) {
			n = -1 * this.size;
		}

		/* Check if card is already present */
		if (this.decklist.has(name)) {
			var entry = this.decklist.get(name);

			/* Check number of copies, but not if adding/removing empty cards */
			if (name != "") {
				if ((entry[1] + n) > this.maxcopies) {
					n = this.maxcopies - entry[1];
				}
				if ((entry[1] + n) < 0) {
					n = -1 * entry[1];
				}
			}

			/* Update decklist */
			entry[1] += n;
			this.decklist.set(name, entry);
			this.size += n;
		}
		else {
			/* Update decklist */
			this.decklist.set(name, [new Card(name), n]);
			this.size += n;
		}
	}

	/* Function to add or remove empty cards from a deck 
	 * Passing a negative value for n removes cards
	 */
	addEmptyCard(n) {
		this.addCard("",n);
	}
}