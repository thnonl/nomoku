export const Constants = {
    BOARD_LENGTH: 15,
    WINS_COUNT: 5,
};

export const GameStatus = {
    WAITING: 'waiting',
    END: 'end',
    DRAW: 'draw'
};

export const WinRuleTypes = {
    HORIZONTAL: 1,
    VERTICAL: 2,
    FIRST_CROSS_TO_RIGHT: 3,
    SECOND_CROSS_TO_RIGHT: 4,
    FIRST_CROSS_TO_LEFT: 5,
    SECOND_CROSS_TO_LEFT: 6,
};