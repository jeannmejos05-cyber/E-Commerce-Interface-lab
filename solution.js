function checkVariable(input) {
    switch (typeof input) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'bigint':
        case 'undefined':
            return typeof input;
        default:
            return 'object';
    }
}

function generateIDs(count) {
    const ids = [];
    for (let i = 0; i < count; i++) {
        if (i === 5) {
            continue;
        }
        ids.push(`ID-${i}`);
    }
    return ids;
}

function calculateTotal(...numbers) {
    return numbers.reduce((sum, current) => {
        if (typeof current !== 'number') {
            throw new TypeError('Invalid input: All arguments must be numbers');
        }
        return sum + current;
    }, 0);
}

function getTopScorers(playerList) {
    return playerList
        .filter(player => player.score > 8)
        .map(player => player.name)
        .join(', ');
}

class Item {
    #discount = 0.1; // 10% discount

    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    get finalPrice() {
        return this.price - (this.price * this.#discount);
    }
}

function safeDivide(a, b) {
    try {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    } catch (error) {
        return error.message;
    } finally {
        console.log('Operation attempted');
    }
}

console.log('=== Problem 1: Strict Type Checker ===');
console.log(checkVariable('hello'));  // string
console.log(checkVariable(42));        // number
console.log(checkVariable(true));      // boolean
console.log(checkVariable(123n));      // bigint
console.log(checkVariable(undefined)); // undefined
console.log(checkVariable(null));      // object
console.log(checkVariable({}));        // object

console.log('\n=== Problem 2: Secure ID Generator ===');
console.log(generateIDs(7));

console.log('\n=== Problem 3: Functional Sum ===');
console.log(calculateTotal(1, 2, 3, 4)); 
try {
    console.log(calculateTotal(1, '2', 3));
} catch (error) {
    console.log(error.message);
}

console.log('\n=== Problem 4: Leaderboard Filter ===');
const players = [
    { name: 'Joyce', score: 10 },
    { name: 'Mary', score: 5 },
    { name: 'Lucille', score: 9 },
    { name: 'Alma', score: 7 },
    { name: 'Kyle', score: 12 }
];
console.log(getTopScorers(players));

console.log('\n=== Problem 5: Private Inventory ===');
const item = new Item('Laptop', 1000);
console.log(item.name);         
console.log(item.price);        
console.log(item.finalPrice);   

console.log('\n=== Problem 6: Robust Division ===');
console.log(safeDivide(10, 2));   
console.log(safeDivide(10, 0));  