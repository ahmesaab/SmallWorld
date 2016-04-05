/**
 * Created by Ahmed on 3/19/2016.
 */

var localPlayer;
var navigationMap;
var graphicsMap;
var assets;
var exits;

function onSocketConnected() {
    console.log("Connected to socket server");
    var gameStatusElement = $('#gameSocketStatus');
    gameStatusElement.text(' (connected)');
    gameStatusElement.css('color', 'green');
};

function onYou(player) {
    console.log("Got Player Data from Server");
    localPlayer = player;
};

function onMap(data)
{
    console.log("Got Map Data from Server");
    navigationMap = data.navMap;
    navigationMap.width = data.width;
    navigationMap.height = data.height;
    graphicsMap = data.draMap
    assets = data.assets;
    exits = data.exits;
    updateMapNameUi(data.name)
    startAnimation();
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    var gameStatusElement = $('#gameSocketStatus');
    gameStatusElement.text(' (disconnected)');
    gameStatusElement.css('color', 'red');
};

function onMessage(data) {
    console.log("Got Message from "+data.nickName+" saying "+data.message);
    addMessageToUi(data.message, data.nickName, playerById(data.id));
};

function onNewPlayer(player) {
    console.log("Player "+player.socketId+" was connected")
    addPlayerToStage(player);
    remotePlayers.push(player);
};

function onMovePlayer(data) {
    console.log("Player "+data.id+" moved");
    var movePlayer = playerById(data.id);
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    movePlayer.grant.x = data.x*navigationMap.cellLength;
    movePlayer.grant.y = data.y*navigationMap.cellLength;
    movePlayer.grant.gotoAndStop(data.frame);
    movePlayer.x = data.x;
    movePlayer.y = data.y;
};

function onRemovePlayer(playerId) {
    console.log("Player "+playerId+" was disconnected");
    var removePlayer = playerById(playerId);
    if (!removePlayer) {
        console.log("Player not found: "+playerId);
        return;
    };
    stage.removeChild(removePlayer.grant);
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};
