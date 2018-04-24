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
     constructor(card_name) {
        if ((card_name === undefined) || (card_name === "")) {
            this.card_name = "";
            this.cmc = -1;
        }
        else {
            // Build request URL
            var url = "https://api.scryfall.com/cards/named?get_exact="+name;

            // Make request to Scryfall API
            var req = new XMLHttpRequest();
            req.open("GET", url, false);
            req.send();
            var cardinfo = JSON.parse(req.responseText);
            
            // Store all card info in Card object
            this.card_name = cardinfo.name;
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
     constructor(deck_name) {
        this.deck_name = deck_name;
        this.max_size = 60;
        this.max_copies = 4;
        this.size = 0;
        this.deck_list = new Map();

        this.addEmptyCard(this.max_size);
     }

    /* Function to add or remove cards from a deck 
     * Passing a negative value for n removes cards
     * If there isn't enough room, adds only as many as will fit
     * If there are empty cards and we're at maximum deck size,
     *  removes empty cards to make room
     * Returns number of cards added / removed
     */
     addCard(card_name, n) {
        /* Check size */
        if ((this.size + n) > this.max_size) {
            /* If empty cards can be removed, do that */
            var num_over = this.size + n - this.max_size;
            while((num_over > 0) && (this.addCard("", -1))) {
                num_over--;
            }
            n = n - num_over;
        }
        if ((this.size + n) < 0) {
            n = -1 * this.size;
        }

        /* Check if card is already present */
        if (this.deck_list.has(card_name)) {
            var entry = this.deck_list.get(card_name);

            /* Check number of copies, but not if adding/removing empty cards */
            if (name != "") {
                if ((entry[1] + n) > this.max_copies) {
                    n = this.max_copies - entry[1];
                }
                if ((entry[1] + n) < 0) {
                    n = -1 * entry[1];
                }
            }

            /* Update decklist */
            entry[1] += n;
            this.deck_list.set(name, entry);
            this.size += n;
        }
        else {
            /* Update decklist */
            this.deck_list.set(name, [new Card(card_name), n]);
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
    probDraw(card_name, target_num, num_draws, get_exact) {
        card_name = card_name || "";
        target_num = target_num || 1;
        num_draws = num_draws || 1;
        get_exact = get_exact || 1;

        var size = this.size;
        var duplicates = this.decklist.get(card_name)[1];

        return this.probDrawHelper(card_name, size, duplicates, target_num, num_draws, get_exact);
    }
    probDrawHelper(card_name, size, duplicates, target_num, num_draws, get_exact) {
        card_name = card_name || "";
        size = size || this.size;
        duplicates = duplicates || this.deck_list.get(card_name)[1];
        target_num = target_num || 1;
        num_draws = num_draws || 1;
        get_exact = get_exact || 1; 

        if (get_exact) {
            var bincoeff = fac(num_draws) / (fac(target_num) * fac(num_draws - target_num));
            var top  = fac(duplicates) * fac(size - duplicates) * fac(size - num_draws);
            var bot = fac(duplicates - target_num) * fac(size - duplicates + num_draws - target_num) * fac(size);
            var prob = bincoeff * top / bot;
        }
        else {
            var prob = 0;
            for (var i = 1; i <= target_num; i++) {
                prob += this.probDrawHelper(card_name, size, duplicates, i, num_draws, 1);
            }
        }

        return prob;
    }
    probDrawMultiple(card_name, size, duplicates, target_num, num_draws, get_exact) {
        card_name = card_name || [""];
        size = size || this.size;
        duplicates = duplicates || [this.deck_list.get(card_name)[1]];
        target_num = target_num || [1];
        num_draws = num_draws || 1;
        get_exact = get_exact || [1];

        /* Make sure list arguments have the same length */
        if (card_name.length != duplicates.length != target_num.length != get_exact.length) {
            throw "List parameters (card_name, duplicates, target_num and get_exact) must have same length";
        }
        
    }
}