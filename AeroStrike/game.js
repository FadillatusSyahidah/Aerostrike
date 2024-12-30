let plane = document.getElementById('plane');
let planePosition = { x: 150, y: 300 };
let bullets = [];
let enemies = [];
let score = 0;
let gamePaused = false;
let currentLevel = 'easy';
let currentPlayer = 1;
let gameOver = false;  // Flag for Game Over
let backgroundMusic = new Audio('assets/background_sound.mp3');
backgroundMusic.loop = true;
let explosionSound = new Audio('assets/explosion_sound.mp3');
let gameIntervals = [];
let isShooting = false;
let moveSpeed = 50;
let bulletSpeed = 50;
let moveDirection = { x: 0, y: 0 };
let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

// Touch event handling
function setupTouchControls() {
    document.getElementById('gameArea').addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        // Trigger shooting when touch starts
        if (!isShooting) {
            isShooting = true;
            shootBullet();  // Shoot once when touch starts
        }

        event.preventDefault(); // Prevent default actions like scrolling
    });

    document.getElementById('gameArea').addEventListener('touchmove', (event) => {
        if (gamePaused || gameOver) return;

        let deltaX = event.touches[0].clientX - touchStartX;
        let deltaY = event.touches[0].clientY - touchStartY;

        // Move plane based on the touch movement
        movePlane(deltaX, deltaY);

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        event.preventDefault();
    });

    document.getElementById('gameArea').addEventListener('touchend', () => {
        isShooting = false;  // Stop shooting when touch ends
        event.preventDefault();  // Prevent default actions like scrolling
    });
}

function shootBullet() {
    if (gameOver) return;  // Stop shooting if the game is over

    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${planePosition.x + plane.offsetWidth / 2 - 15}px`; // Center bullet
    bullet.style.top = `${planePosition.y}px`;
    document.body.appendChild(bullet);

    bullets.push(bullet);

    let bulletInterval = setInterval(() => {
        bullet.style.top = `${parseInt(bullet.style.top) - bulletSpeed}px`;  // Move bullet upwards

        if (parseInt(bullet.style.top) < 0) {
            clearInterval(bulletInterval);
            document.body.removeChild(bullet);
            bullets = bullets.filter(b => b !== bullet); // Remove from bullets array
        }

        // Check for collisions with enemies
        enemies.forEach(enemy => {
            if (isCollision(bullet, enemy)) {
                document.body.removeChild(bullet);
                document.body.removeChild(enemy);
                bullets = bullets.filter(b => b !== bullet);
                enemies = enemies.filter(e => e !== enemy);

                const enemyType = enemy.style.backgroundImage;
                score += enemyType.includes('enemy2.png') ? 20 : 10;

                updateScore();
                explodeEffect(enemy);  // Explosion effect
            }
        });
    }, 15);  // Move bullet every 15ms
}

// Function to move the plane with smooth control
function movePlane(dx, dy) {
    if (gameOver) return;  // Stop movement if the game is over

    // Update the position of the plane
    planePosition.x += dx;
    planePosition.y += dy;

    // Restrict movement within the boundaries of the screen
    if (planePosition.x < 0) planePosition.x = 0;
    if (planePosition.x > window.innerWidth - 50) planePosition.x = window.innerWidth - 50;
    if (planePosition.y < 0) planePosition.y = 0;
    if (planePosition.y > window.innerHeight - 50) planePosition.y = window.innerHeight - 50;

    // Update the plane's position on the screen
    plane.style.left = `${planePosition.x}px`;
    plane.style.top = `${planePosition.y}px`;
}


// Bullet shooting function
function shootBullet() {
    if (gameOver) return;  // Stop shooting if the game is over

    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${planePosition.x + plane.offsetWidth / 2 - 15}px`;  // Adjust to the center of the plane
    bullet.style.top = `${planePosition.y}px`;
    document.body.appendChild(bullet);

    bullets.push(bullet);

    let bulletInterval = setInterval(() => {
        bullet.style.top = `${parseInt(bullet.style.top) - bulletSpeed}px`;  // Move the bullet upwards

        // Remove bullet when it goes out of the screen
        if (parseInt(bullet.style.top) < 0) {
            clearInterval(bulletInterval);
            document.body.removeChild(bullet);
            bullets = bullets.filter(b => b !== bullet); // Remove from bullets array
        }

        // Collision detection with enemies
        enemies.forEach(enemy => {
            if (isCollision(bullet, enemy)) {
                document.body.removeChild(bullet);
                document.body.removeChild(enemy);
                bullets = bullets.filter(b => b !== bullet);
                enemies = enemies.filter(e => e !== enemy);

                // Check which enemy was hit and adjust score accordingly
                const enemyType = enemy.style.backgroundImage;
                if (enemyType.includes('enemy2.png')) {
                    score += 20;  // enemy2.png gives 20 points
                } else {
                    score += 10;  // enemy.png gives 10 points
                }

                updateScore();
                explodeEffect(enemy);  // Show explosion effect
            }
        });
    }, 15);  // Move bullet every 15ms
}

// Setup game dengan touch controls dan keyboard controls
function setupGame() {
    // Setup kontrol keyboard
    document.addEventListener('keydown', (event) => {
        if (gamePaused) return;

        switch (event.key) {
            case 'ArrowUp': 
                moveDirection.y = -1; 
                break;
            case 'ArrowDown': 
                moveDirection.y = 1; 
                break;
            case 'ArrowLeft': 
                moveDirection.x = -1; 
                break;
            case 'ArrowRight': 
                moveDirection.x = 1; 
                break;
            case ' ' : 
                if (!isShooting) {  // Start shooting only if not already shooting
                    isShooting = true;
                    shootBullet();
                }
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === ' ') {
            isShooting = false; // Stop continuous shooting
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            moveDirection.y = 0; // Stop vertical movement
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            moveDirection.x = 0; // Stop horizontal movement
        }
    });

    setInterval(() => {
        movePlane(moveDirection.x * moveSpeed, moveDirection.y * moveSpeed); 
        if (isShooting) shootBullet(); // Keep shooting while spacebar is held
    }, 15);

    setInterval(createEnemy, currentLevel === 'easy' ? 3000 : currentLevel === 'medium' ? 2000 : 1000);

    // Setup kontrol layar sentuh
    setupTouchControls();
}


// Function to set the plane image based on selected player
function setPlaneImage(playerNumber) {
    let planeImage = '';
    if (playerNumber === 1) {
        planeImage = 'assets/plane_1.png';
    } else if (playerNumber === 2) {
        planeImage = 'assets/plane_2.png';
    } else if (playerNumber === 3) {
        planeImage = 'assets/plane_3.png';
    }

    // Update the plane image by setting the background image
    plane.style.backgroundImage = `url('${planeImage}')`;
}

// Select Player
function selectPlayer(playerNumber) {
    currentPlayer = playerNumber;
    setPlaneImage(playerNumber);  // Set the plane image when player is selected
    document.getElementById('player-selection').style.display = 'none';
    document.getElementById('level-selection').style.display = 'block';
}

// Select Level
function selectLevel(level) {
    currentLevel = level;
    
    // Set move speed based on the selected level
    if (currentLevel === 'easy') {
        moveSpeed = 30;  // Kecepatan gerakan pesawat lebih lambat di level mudah
    } else if (currentLevel === 'medium') {
        moveSpeed = 50;  // Kecepatan gerakan pesawat standar di level medium
    } else if (currentLevel === 'hard') {
        moveSpeed = 70;  // Kecepatan gerakan pesawat lebih cepat di level sulit
    }
    
    document.getElementById('level-selection').style.display = 'none';
    startGame();
}

// Start Game
function startGame() {
    fetch('index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=start'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'action received') {
            document.getElementById('game-start-btn').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            document.getElementById('scoreboard').style.display = 'block';
            document.getElementById('pause-btn').style.display = 'inline-block';
            document.getElementById('back-btn').style.display = 'inline-block';
            setupGame();
            backgroundMusic.play();
        }
    });
}

// Move Plane with smoother control
function movePlane(dx, dy) {
    if (gameOver) return;  // Stop movement if the game is over

    // Update posisi pesawat berdasarkan perubahan X dan Y
    planePosition.x += dx;
    planePosition.y += dy;

    // Batasi pergerakan pesawat agar tidak keluar dari layar
    if (planePosition.x < 0) planePosition.x = 0;
    if (planePosition.x > window.innerWidth - 50) planePosition.x = window.innerWidth - 50;
    if (planePosition.y < 0) planePosition.y = 0;
    if (planePosition.y > window.innerHeight - 50) planePosition.y = window.innerHeight - 50;

    // Update posisi di tampilan
    plane.style.left = `${planePosition.x}px`;
    plane.style.top = `${planePosition.y}px`;

    // Memperbarui posisi latar belakang agar bergerak mengikuti pesawat
    let backgroundOffset = planePosition.y / 3;  
    document.body.style.backgroundPosition = `center ${backgroundOffset}px`;
}

// Shoot Bullet
function shootBullet() {
    if (gameOver) return;  // Stop shooting if the game is over

    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${planePosition.x + plane.offsetWidth / 2 - 15}px`;
    bullet.style.top = `${planePosition.y}px`;
    document.body.appendChild(bullet);

    bullets.push(bullet);

    let bulletInterval = setInterval(() => {
        bullet.style.top = `${parseInt(bullet.style.top) - bulletSpeed}px`;

        if (parseInt(bullet.style.top) < 0) {
            clearInterval(bulletInterval);
            document.body.removeChild(bullet);
            bullets = bullets.filter(b => b !== bullet);
        }

        enemies.forEach(enemy => {
            if (isCollision(bullet, enemy)) {
                document.body.removeChild(bullet);
                document.body.removeChild(enemy);
                bullets = bullets.filter(b => b !== bullet);
                enemies = enemies.filter(e => e !== enemy);
                
                // Check which enemy was hit and adjust score accordingly
                const enemyType = enemy.style.backgroundImage;
                if (enemyType.includes('enemy2.png')) {
                    score += 20;  // enemy2.png gives 20 points
                } else {
                    score += 10;  // enemy.png gives 10 points
                }
                
                updateScore();
                explodeEffect(enemy);
            }
        });
    }, 15);
}

// Explosion Effect
function explodeEffect(enemy) {
    explosionSound.play();

    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = enemy.style.left;
    explosion.style.top = enemy.style.top;
    document.body.appendChild(explosion);

    setTimeout(() => {
        document.body.removeChild(explosion);
    }, 500);
}

// Collision Detection
function isCollision(bullet, enemy) {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    return !(bulletRect.right < enemyRect.left || 
             bulletRect.left > enemyRect.right || 
             bulletRect.bottom < enemyRect.top || 
             bulletRect.top > enemyRect.bottom);
}

// Check for collision between plane and enemy
function checkGameOver() {
    enemies.forEach(enemy => {
        if (isCollision(plane, enemy)) {
            endGame();  // Trigger game over if collision detected
        }
    });
}

// End Game
function endGame() {
    if (gameOver) return;  // Avoid multiple game over triggers

    gameOver = true;
    backgroundMusic.pause();  // Stop background music
    backgroundMusic.currentTime = 0;  // Reset music to start
    showGameOverScreen();  // Display Game Over screen
    gameIntervals.forEach(interval => clearInterval(interval));  // Stop all intervals
}

// Show Game Over Screen with attractive styling
function showGameOverScreen() {
    let gameOverElement = document.createElement('div');
    gameOverElement.id = 'game-over';
    gameOverElement.textContent = `Game Over!`;

    // Create and append score element
    let scoreElement = document.createElement('div');
    scoreElement.classList.add('score');
    scoreElement.textContent = `Your Score: ${score}`;
    gameOverElement.appendChild(scoreElement);

    // Add the Game Over message to the game area
    document.getElementById('gameArea').appendChild(gameOverElement);

    // Apply the animations after 0.5s delay
    setTimeout(() => {
        gameOverElement.style.opacity = 1;
    }, 500);
}

// Add Enemies
function createEnemy() {
    if (gameOver) return;  // Stop creating enemies if the game is over

    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    
    // Randomly choose between enemy.png and enemy2.png
    const enemyType = Math.random() < 0.5 ? 'enemy.png' : 'enemy2.png';  // 50% chance for each type
    enemy.style.backgroundImage = `url('assets/${enemyType}')`;

    if (enemyType === 'enemy2.png') {
        enemy.classList.add('enemy2');  // Add class for larger enemy2
    }

    enemy.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    enemy.style.top = '0px';
    document.body.appendChild(enemy);

    enemies.push(enemy);

    let speed = currentLevel === 'easy' ? 5 : currentLevel === 'medium' ? 8 : 12; // Adjust speed based on level
    let horizontalSpeed = currentLevel === 'medium' || currentLevel === 'hard' ? Math.random() * 2 - 1 : 0; // Horizontal movement for medium and hard levels

    let enemyInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(enemyInterval);
            return;
        }
        
        enemy.style.top = `${parseInt(enemy.style.top) + speed}px`;
        enemy.style.left = `${parseInt(enemy.style.left) + horizontalSpeed}px`; // Horizontal movement

        // Prevent enemy from going off screen horizontally
        if (parseInt(enemy.style.left) < 0) enemy.style.left = '0px';
        if (parseInt(enemy.style.left) > window.innerWidth - 50) enemy.style.left = `${window.innerWidth - 50}px`;

        if (parseInt(enemy.style.top) > window.innerHeight) {
            clearInterval(enemyInterval);
            document.body.removeChild(enemy);
            enemies = enemies.filter(e => e !== enemy);
        }

        checkGameOver();  // Check for game over every frame
    }, currentLevel === 'easy' ? 100 : currentLevel === 'medium' ? 80 : 60); // Adjust speed interval for difficulty

    gameIntervals.push(enemyInterval);
}


// Update Score
function updateScore() {
    let scoreElement = document.getElementById('scoreboard');
    scoreElement.textContent = `Score: ${score}`;
    updateLevel();
}

// Update Level function
function updateLevel() {
    let level = Math.floor(score / 100);
    let levelMessage = `Level: ${level}`;

    let levelElement = document.getElementById('level-info');
    if (!levelElement) {
        levelElement = document.createElement('div');
        levelElement.id = 'level-info';
        document.getElementById('gameArea').appendChild(levelElement);
    }

    levelElement.textContent = levelMessage;

    if (score % 100 === 0 && score !== 0) {
        showLevelUpNotification(level);
    }
}

// Show level-up notification
function showLevelUpNotification(level) {
    let notification = document.createElement('div');
    notification.classList.add('level-up-notification');
    notification.textContent = `Congratulations! You've reached Level ${level}!`;

    document.getElementById('gameArea').appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            document.getElementById('gameArea').removeChild(notification);
        }, 1000);
    }, 3000);
}

// Setup Game with smooth movement and controls
function setupGame() {
    // Keyboard Controls
    document.addEventListener('keydown', (event) => {
        if (gamePaused || gameOver) return;

        switch (event.key) {
            case 'ArrowUp': 
                moveDirection.y = -1; 
                break;
            case 'ArrowDown': 
                moveDirection.y = 1; 
                break;
            case 'ArrowLeft': 
                moveDirection.x = -1; 
                break;
            case 'ArrowRight': 
                moveDirection.x = 1; 
                break;
            case ' ' : 
                if (!isShooting) {  
                    isShooting = true;
                    shootBullet();
                }
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === ' ') {
            isShooting = false;
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            moveDirection.y = 0; 
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            moveDirection.x = 0; 
        }
    });

    // Game Loop Intervals
    setInterval(() => {
        movePlane(moveDirection.x * moveSpeed, moveDirection.y * moveSpeed); 
        if (isShooting) shootBullet();
    }, 15);

    setInterval(createEnemy, currentLevel === 'easy' ? 3000 : currentLevel === 'medium' ? 2000 : 1000);

    // Touch Controls
    setupTouchControls();
}

// Toggle Pause
function togglePause() {
    gamePaused = !gamePaused;
    document.getElementById('continue-btn').style.display = gamePaused ? 'inline-block' : 'none';
    document.getElementById('pause-btn').style.display = gamePaused ? 'none' : 'inline-block';

    gameIntervals.forEach(interval => clearInterval(interval));
}

// Continue Game
function continueGame() {
    gamePaused = false;
    document.getElementById('continue-btn').style.display = 'none';
    document.getElementById('pause-btn').style.display = 'inline-block';
    gameIntervals.forEach(interval => interval);
}

// Back to Start
function goBack() {
    window.location.reload();
}
