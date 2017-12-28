import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import Constants from '../../lib/constants';
import {Games} from '../../lib/collections';

Template.board.helpers({
    sideLength: () => {
        let side = new Array(Constants.BOARD_LENGTH);
        side.fill(0);

        return side;
    },

    isMarked: (x, y) => {
        if (Session.get("inGame")) {
            let myGame = Games.findOne();

            if (myGame !== undefined && myGame.status !== "waiting") {
                for (let i = 0; i < myGame.moves.length; i++) {
                    if (myGame.moves[i].move === x + '' + y) {
                        if (myGame.moves[i].playerID === Meteor.userId())
                            return "<p class='mark'>X</p>";
                        else
                            return "<p class='mark'>O</p>";
                    }
                }
                if (myGame.status === Meteor.userId())
                    return "<div class='selectableField' x='" + x + "' y='" + y + "'></div>";
            }
        }
    }
});

Template.board.events({
    "click .selectableField": (event) => {
        Meteor.call("games.makeMove", event.target.getAttribute('x'), event.target.getAttribute('y'));
    }
});