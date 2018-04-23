//import {fac} from './Utilities';

/* Utility functions */
function fac(n) {
	var fac = 1;

	for (var i = 2; i <= n; i++) {
		fac = fac * i;
	}

	return fac;
}

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
	 * If there isn't enough room, adds only as many as will fit
	 * If there are empty cards and we're at maximum deck size,
	 *	removes empty cards to make room
	 * Returns number of cards added / removed
	 */
	addCard(name, n) {
		/* Check size */
		if ((this.size + n) > this.maxsize) {
			/* If empty cards can be removed, do that */
			var numover = this.size + n - this.maxsize;
			while((numover > 0) && (this.addCard("", -1))) {
				numover--;
			}
			n = n - numover;
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

		return n;
	}

	/* Function to add or remove empty cards from a deck 
	 * Passing a negative value for n removes cards
	 */
	addEmptyCard(n) {
		this.addCard("",n);
	}

	/* Function to calculate probability of drawing a specific card
	 */
	probDraw(name, ntargets, ndraws, exact) {
		name = name || "";
		ntargets = ntargets || 1;
		ndraws = ndraws || 1;
		exact = exact || 1;

		var size = this.size;
		var ncards = this.decklist.get(name)[1];

		return this.probDrawHelper(name, size, ncards, ntargets, ndraws, exact);
	}
	probDrawHelper(name, size, ncards, ntargets, ndraws, exact) {
		name = name || "";
		size = size || this.size;
		ncards = ncards || this.decklist.get(name)[1];
		ntargets = ntargets || 1;
		ndraws = ndraws || 1;
		exact = exact || 1;	

		if (exact) {
			var bincoeff = fac(ndraws) / (fac(ntargets) * fac(ndraws - ntargets));
			var top  = fac(ncards) * fac(size - ncards) * fac(size - ndraws);
			var bot = fac(ncards - ntargets) * fac(size - ncards + ndraws - ntargets) * fac(size);
			var prob = bincoeff * top / bot;
		}
		else {
			var prob = 0;
			for (var i = 1; i <= ntargets; i++) {
				prob += this.probDrawHelper(name, size, ncards, i, ndraws, 1);
			}
		}

		return prob;
	}
	probDrawMultiple(name, size, ncards, ntargets, ndraws, exact) {
		name = name || [""];
		size = size || this.size;
		ncards = ncards || [this.decklist.get(name)[1]];
		ntargets = ntargets || [1];
		ndraws = ndraws || 1;
		exact = exact || [1];

		/* Make sure list arguments have the same length */
		if (name.length != ncards.length != ntargets.length != exact.length) {
			throw "List parameters (name, ncards, ntargets and exact) must have same length";
		}
		
	}
}