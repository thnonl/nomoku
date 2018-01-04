import {Constants, WinRuleTypes} from "./constants";

export const getMoveCounts = (WinRules) => {
    let moveCounts = [];
    for (let i = 0; i < WinRules.length; i++) {
        moveCounts.push(0);
    }
    return moveCounts;
};

export const getAllWinRules = () => {
    let result = [];
    for (let x = 0; x < Constants.BOARD_LENGTH; x++) {
        for (let y = 0; y < Constants.BOARD_LENGTH; y++) {
            //horizontal rules
            let horizontalRules = createWinRules(WinRuleTypes.HORIZONTAL, x, y);
            if (horizontalRules.length === 1){
                result = result.concat(horizontalRules);
            }

            //vertical rules
            let verticalRules = createWinRules(WinRuleTypes.VERTICAL, y, x);
            if (verticalRules.length === 1){
                result = result.concat(verticalRules);
            }

            //first cross left top to right bottom rules
            let firstCrossToRightRules = createWinRules(WinRuleTypes.FIRST_CROSS_TO_RIGHT, x, y);
            if (firstCrossToRightRules.length === 1){
                result = result.concat(firstCrossToRightRules);
            }

            //second cross left top to right bottom
            let secondCrossToRightRules = createWinRules(WinRuleTypes.SECOND_CROSS_TO_RIGHT, x, y);
            if (secondCrossToRightRules.length === 1){
                result = result.concat(secondCrossToRightRules);
            }

            //first cross right top to left bottom
            let firstCrossToLeftRules =  createWinRules(WinRuleTypes.FIRST_CROSS_TO_LEFT, x, y);
            if (firstCrossToLeftRules.length === 1){
                result = result.concat(firstCrossToLeftRules);
            }

            //second cross right top to left bottom
            let secondCrossToLeftRules = createWinRules(WinRuleTypes.SECOND_CROSS_TO_LEFT, x, y);
            if (secondCrossToLeftRules.length === 1){
                result = result.concat(secondCrossToLeftRules);
            }
        }
    }
    return result;
};

const createWinRules = (type, x, y) => {
    let wins = [];
    let match = [];
    switch (type) {
        case WinRuleTypes.HORIZONTAL:
        case WinRuleTypes.VERTICAL:
            match = createStraightRules(x, y);
            break;
        case WinRuleTypes.FIRST_CROSS_TO_RIGHT:
            match = createFirstCrossToRightRules(x, y);
            break;
        case WinRuleTypes.SECOND_CROSS_TO_RIGHT:
            match = createSecondCrossToRightRules(x, y);
            break;
        case WinRuleTypes.FIRST_CROSS_TO_LEFT:
            match = createFirstCrossToLeftRules(x, y);
            break;
        case WinRuleTypes.SECOND_CROSS_TO_LEFT:
            match = createSecondCrossToLeftRules(x, y);
            break;
        default:
            break;
    }

    if (match.length === 5) {
        wins.push(match);
    }
    return wins;
};

const createStraightRules = (x, y) => {
    let match = [];

    for (let k = x; k < Constants.WINS_COUNT + x; k++) {
        match.push({positionX: y, positionY: k});
    }

    return match;
};

const createFirstCrossToRightRules = (x, y) => {
    let match = [];
    let h = x + y;

    for (let k = y; k < Constants.WINS_COUNT + y; k++) {
        if (h <= Constants.BOARD_LENGTH) {
            match.push({positionX: h, positionY: k});
            h++;
        }
        else {
            break;
        }
    }

    return match;
};

const createSecondCrossToRightRules = (x, y) => {
    let match = [];
    let j = x + y;

    for (let i = 0; i < Constants.WINS_COUNT; i++) {
        if (j <= Constants.BOARD_LENGTH) {
            match.push({positionX: i, positionY: j});
            j++;
        }
        else {
            break;
        }
    }

    return match;
};

const createFirstCrossToLeftRules = (x, y) => {
    let match = [];
    let j = x + y;

    for (let i = Constants.WINS_COUNT + y; i > y; i--) {
        if (j <= Constants.BOARD_LENGTH) {
            match.push({positionX: j, positionY: i});
            j++;
        }
        else {
            break;
        }
    }

    return match;
};

const createSecondCrossToLeftRules = (x, y) => {
    let match = [];
    let j = x + y;

    for (let i = Constants.WINS_COUNT + y; i > y; i--) {
        if (j <= Constants.BOARD_LENGTH) {
            match.push({positionX: i, positionY: j});
            j++;
        }
        else {
            break;
        }
    }

    return match;
};