<?php
// File: index.php

// Handle game start action (can be extended for further actions like saving scores)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    echo json_encode(['status' => 'action received', 'action' => $action]);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game AeroStrike</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="game-container">
        <h1>Game AeroStrike</h1>

        <!-- Score and Level display below the Game title -->
        <div id="score-level-container">
            <div id="scoreboard">Score: 0</div>
            <div id="level-info">Level: 0</div>
        </div>

        <!-- Player Selection Screen -->
        <div id="player-selection" class="selection-screen">
            <h2>Select Player</h2>
            <div class="player-buttons">
                <button class="player-btn" onclick="selectPlayer(1)">Player 1</button>
                <button class="player-btn" onclick="selectPlayer(2)">Player 2</button>
                <button class="player-btn" onclick="selectPlayer(3)">Player 3</button>
            </div>
        </div>

        <!-- Level Selection Screen -->
        <div id="level-selection" style="display:none;">
            <h2>Select Difficulty</h2>
            <button onclick="selectLevel('easy')">Easy</button>
            <button onclick="selectLevel('medium')">Medium</button>
            <button onclick="selectLevel('hard')">Hard</button>
        </div>

        <!-- Start Game Button -->
        <button id="game-start-btn" onclick="startGame()" style="display:none;">Start Game</button>

        <!-- Game Area -->
        <div id="gameArea" style="display:none;">
            <div id="plane" class="plane"></div>
            <div id="scoreboard" class="scoreboard"></div>
        </div>

        <!-- Pause, Continue, and Back Buttons -->
        <div class="button-container">
            <!-- The Pause/Continue buttons will be positioned in the top-right corner -->
            <div id="pause-continue-container" class="top-right">
                <button id="pause-btn" onclick="togglePause()" style="display: none;">Pause</button>
                <button id="continue-btn" onclick="continueGame()" style="display: none;">Continue</button>
            </div>
            <!-- The Back to Start button will be positioned in the top-left corner -->
            <div id="back-btn-container" class="top-left">
                <button id="back-btn" onclick="goBack()" style="display: none;">Back to Start</button>
            </div>
        </div>

    </div>

    <script src="game.js"></script>
</body>
</html>
