import {Constants} from "./constants";

export const getMoveCounts = (WinRules) => {
    let moveCounts = [];
    for (let i = 0; i < WinRules.length; i++) {
        moveCounts.push(0);
    }
    return moveCounts;
};

export const getAllWinRules = () => {
    let wins = [];
    for (let i = 0; i < Constants.BOARD_LENGTH; i++) {
        let match = [];

        for (let j = 0; j < Constants.BOARD_LENGTH; j++) {
            //horizontal rules
            match = [];
            for (let k = i; k < Constants.WINS_COUNT + i; k++) {
                match.push({positionX: j, positionY: k});
            }
            if (match.length === 5) {
                wins.push(match);
            }

            //vertical rules
            match = [];
            for (let k = i; k < Constants.WINS_COUNT + i; k++) {
                match.push({positionX: k, positionY: j});
            }
            if (match.length === 5) {
                wins.push(match);
            }

            //first cross left top to right bottom
            match = [];
            let h = i + j;
            for (let k = j; k < Constants.WINS_COUNT + j; k++) {
                if (h <= Constants.BOARD_LENGTH) {
                    match.push({positionX: h, positionY: k});
                    h++;
                }
                else{
                    break;
                }
            }
            if (match.length === 5) {
                wins.push(match);
            }

            //second cross left top to right bottom
            match = [];
            let h1 = i + j;
            for (let k = 0; k < Constants.WINS_COUNT; k++) {
                if (h1 <= Constants.BOARD_LENGTH) {
                    match.push({positionX: k, positionY: h1});
                    h1++;
                }
                else{
                    break;
                }
            }
            if (match.length === 5) {
                wins.push(match);
            }

            //first cross right top to left bottom
            match = [];
            let o = i + j;
            for (let k = Constants.WINS_COUNT + j; k > j; k--) {
                if (o <= Constants.BOARD_LENGTH) {
                    match.push({positionX: o, positionY: k});
                    o++;
                }
                else{
                    break;
                }
            }
            if (match.length === 5) {
                wins.push(match);
            }

            //second cross right top to left bottom
            match = [];
            let o1 = i + j;
            for (let k = Constants.WINS_COUNT + j; k > j; k--) {
                if (o1 <= Constants.BOARD_LENGTH) {
                    match.push({positionX: k, positionY: o1});
                    o1++;
                }
                else{
                    break;
                }
            }
            if (match.length === 5) {
                wins.push(match);
            }
        }
    }
    return wins;
};