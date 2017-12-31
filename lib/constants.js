export const Constants = {
    BOARD_LENGTH: 9,
    WINS_COUNT: 5,
};

export const GameStatus = {
    WAITING: 'waiting',
    END: 'end',
    DRAW: 'draw'
};

const wins = [];

for (let i = 0; i < Constants.BOARD_LENGTH; i++) {
    //horizontal rules
    for (let j = 0; j < Constants.BOARD_LENGTH; j++) {
        let match = [];
        for (let k = i; k < Constants.WINS_COUNT + i; k++) {
            match.push({positionX: j, positionY: k});
        }
        wins.push(match);
    }
    //vertical rules
    for (let j = 0; j < Constants.BOARD_LENGTH; j++) {
        let match = [];
        for (let k = i; k < Constants.WINS_COUNT + i; k++) {
            match.push({positionX: k, positionY: j});
        }
        wins.push(match);
    }
}

export const WinRules = wins;

let winCounts = [];
for (let i = 0; i < wins.length; i++) {
    winCounts.push(0);
}

export const WinCounts = winCounts;