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
        if (Session.get("inGame")) {
            Session.set("inGame", false);
            Meteor.logout(function () {
                $('#create-btn').fadeOut(400);
                setTimeout(function () {
                    Session.set("inGame", true);
                    Meteor.call("games.create");
                    Meteor.subscribe('MyGame');
                }, 500);
            });
        }
        else {
            $('#create-btn').fadeOut(400);
            Session.set("inGame", true);
            Meteor.call("games.create");
            Meteor.subscribe('MyGame');
        }
    },
    "click #give-up-btn": () => {
        if (Session.get("inGame")) {
            Session.set("inGame", false);
            Meteor.call("games.giveUp");
            Meteor.logout();
        }
    },
    "click #join-btn": () => {
        if (Session.get("inGame")) {
            Session.set("inGame", false);
            Meteor.logout(function () {
                $('#create-btn').fadeOut(400);
                setTimeout(function () {
                    Session.set("inGame", true);
                    Meteor.call("games.join");
                    Meteor.subscribe('MyGame');
                }, 500);
            });
        }
        else {
            $('#create-btn').fadeOut(400);
            Session.set("inGame", true);
            Meteor.call("games.join");
            Meteor.subscribe('MyGame');
        }
    },
    "click #ok-btn": () => {
        $('.alert-dialog-mask, .alert-dialog').hide();
    }
});

Template.ui.helpers({
    inGame: () => {
        return Session.get("inGame");
    },
    isFinding: () => {
        let myGame = Games.findOne({$and: [{status: GameStatus.WAITING}, {$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]}]});
        return myGame !== undefined ? 'disabled' : '';
    },
    isEndGame: () => {
        let myGame = Games.findOne({$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]});
        return (myGame !== undefined && (myGame.status === GameStatus.END || myGame.status === GameStatus.DRAW));
    },
    status: () => {
        if (Session.get("inGame")) {
            let myGame = Games.findOne({$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]});

            let message = "";
            if (myGame !== undefined) {
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
                }
                else if (myGame.status === GameStatus.END && myGame.result !== Meteor.userId() && myGame.result !== GameStatus.DRAW) {
                    message = "You lost!";
                }
                else if (myGame.result === GameStatus.DRAW) {
                    message = "Draw!";
                }
                else {
                    message = "";
                }
            }

            // Show status
            return message !== "" ?
                "<div class='toast animated out'>" +
                "   <div class='toast__message'>" + message +
                "   </div>" +
                "</div>"
                : "";
        }
    },
    result: () => {
        if (Session.get("inGame")) {
            let myGame = Games.findOne({
                $and: [{status: {$in: [GameStatus.END, GameStatus.DRAW]}},
                    {$or: [{player1: Meteor.userId()}, {player2: Meteor.userId()}]}
                ]
            });

            let message = "";
            if (myGame !== undefined) {
                if (myGame.result === Meteor.userId()) {
                    message = "You won!";
                }
                else if (myGame.status === GameStatus.END && myGame.result !== Meteor.userId() && myGame.result !== GameStatus.DRAW) {
                    message = "You lost!";
                }
                else if (myGame.result === GameStatus.DRAW) {
                    message = "Draw!";
                }
            }

            // Show result if game over
            return message !== "" ?
                "<div class=\"alert-dialog-mask\"></div>" +
                "<div class=\"alert-dialog\">" +
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
                : "";
        }
    }
    ,
    joinBtn: () => {
        let myGame = Games.findOne({status: GameStatus.WAITING});

        return myGame !== undefined
            ?
            "<button class=\"button button--outline\" id=\"join-btn\">Join room</button>" +
            "<i class='center-text'>Game found, you can join the game now! </i>"
            :
            "";
    }
});