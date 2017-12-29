import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {Games} from '../../lib/collections';
import {GameStatus} from "../../lib/constants";

Template.ui.onCreated(() => {
    Meteor.subscribe('Games');
});

Template.ui.events({
    "click #create-btn": () => {
        Session.set("inGame", true);
        Meteor.call("games.create");
        Meteor.subscribe('MyGame');
    },
    "click #give-up-btn": () => {
        if (Session.get("inGame")) {
            Session.set("inGame", false);
            Meteor.call("games.giveUp");
            Meteor.logout();
        }
    },
    "click #join-btn": () => {
        Session.set("inGame", true);
        Meteor.call("games.join");
        Meteor.subscribe('MyGame');
    },
    "click #ok-btn": () => {
        Session.set("inGame", false);
        Meteor.logout();
        $('.alert-dialog-mask, .alert-dialog').hide();
    }
});

Template.ui.helpers({
    inGame: () => {
        return Session.get("inGame");
    },
    disabled: () => {
        let myGame = Games.findOne({$and: [{status: GameStatus.WAITING}, {$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]}]});
        return myGame !== undefined ? 'disabled' : '';
    },
    status: () => {
        if (Session.get("inGame")) {
            let myGame = Games.findOne({$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]});

            let message = "";
            let isGameOver = false;
            if (myGame.status === GameStatus.WAITING) {
                message = "Looking for an opponent...";
            }
            else if (myGame.status === Meteor.userId()) {
                message = "Your turn: X";
            }
            else if (myGame.status !== Meteor.userId() && myGame.status !== GameStatus.END) {
                message = "Opponent's turn: O";
            }
            else if (myGame.result === Meteor.userId()) {
                message = "You won!";
                isGameOver = true;
            }
            else if (myGame.status === GameStatus.END && myGame.result !== Meteor.userId() && myGame.result !== GameStatus.DRAW) {
                message = "You lost!";
                isGameOver = true;
            }
            else if (myGame.result === GameStatus.DRAW) {
                message = "Draw!";
                isGameOver = true;
            }
            else {
                message = "";
            }

            // Show status or message if game over
            return isGameOver
                ?
                "<div class=\"alert-dialog animated\">" +
                "  <div class=\"alert-dialog-container\">" +
                "  <div class=\"alert-dialog-title\">Game over</div>" +
                "  <div class=\"alert-dialog-content\">" + message +
                "  </div>" +
                "" +
                "   <div class=\"alert-dialog-footer alert-dialog-footer--rowfooter\">" +
                "       <button class=\"alert-dialog-button alert-dialog-button--rowfooter\" id='ok-btn'>OK</button>" +
                "   </div>" +
                "  </div>" +
                "</div>"
                :
                "<div class='toast animated out'>" +
                "   <div class='toast__message'>" + message +
                "   </div>" +
                "</div>";
        }
    },
    joinBtn: () => {
        let myGame = Games.findOne({status: GameStatus.WAITING});

        return myGame !== undefined
            ?
            "<button class=\"button button--outline animated out\" id=\"join-btn\">Join room</button>" +
            "<i class='center-text'>Game found, you can join the game now! </i>"
            :
            "";
    }
});