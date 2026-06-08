let path = [];
let enemies = [];
let towers = [];
let projectiles = [];
let boss = [];
let wave = 1;
let lives = 20;
let coins = 300;
let gameState = 'wave';
let selectedTower = null;
let canvas;


const unit = {
  Pistol: { cost: 10, label: 2, range: 100, damage: 1, cooldown: 20 },
  Sniper: { cost: 20, label: 3, range: 500, damage: 225, cooldown: 1000 },
  Colonel: { cost: 40, label: 5, range: 120, damage: 4, cooldown: 30 },
  Assault: { cost: 95, label: 7, range: 130, damage: 3, cooldown: 17 },
  Destroyer: { cost: 220, label: 11, range: 200, damage: 8, cooldown: 6 }
};

function drawMap() {
  canvas = createCanvas(800, 600);
  canvas.parent('game-ui');
  path = [
    createVector(0, 165), createVector(80, 165), createVector(80, 70), createVector(170, 70), createVector(60, 260),
    createVector(150, 260), createVector(150, 300), createVector(210, 300), createVector(210, 360), createVector(100, 360),
    createVector(100, 550), createVector(340, 550), createVector(340, 490), createVector(240, 490), createVector(240, 410),
    createVector(310, 410), createVector(310, 440), createVector(400, 440), createVector(400, 300), createVector(530, 300),
    createVector(530, 380), createVector(595, 380), createVector(595, 220), createVector(450, 220), createVector(450, 0)
  ];

  document.querySelectorAll('.tower-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTower = btn.getAttribute('data-type');
    });
  });
  document.getElementById('start-wave').addEventListener('click', () => {
    startWave();
  });
  document.getElementById('eraser-btn').addEventListener('click', () => {
    coins = 0;
    projectiles = [];
  });

  updateUI();
};

function draw() {
  background('#eee');
  stroke(205);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of path) vertex(p.x, p.y);
  endShape();
  
  for (let tower of towers) {
    tower.update();
    tower.show();
    tower.showRange();
  }
  
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let projectile = projectiles[i];
    projectile.update();
    projectile.show();
    if (projectile.hits()) {
      projectiles.splice(i, 1);
    }
  }
  
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.update();
    enemy.show();
    if (enemy.reachedEnd()) {
      lives -= enemy.damage;
      enemies.splice(i, 1);
    } else if (enemy.health <= 0) {
      coins += enemy.value;
      enemies.splice(i, 1);
    }
  }
  
  for (let i = boss.length - 1; i >= 0; i--) {
    let b = boss[i];
    b.update();
    b.show();
    if (b.reachedEnd()) {
      lives -= b.damage;
      boss.splice(i, 1);
    } else if (b.health <= 0) {
      coins += b.value;
      boss.splice(i, 1);
    }
  }
  
  updateUI();
  
  if (lives <= 0) {
    gameState = 'over';
    textSize(32);
    fill(0);
    textFont('my-computer-modern');
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
    alert(`Game Over: You died after surviving ${wave - 1} waves.`);
    noLoop();
  }
}

function updateUI() {
  const spans = document.querySelectorAll('.status-bar span');
  if (spans.length >= 4) {
    spans[0].innerHTML = `Wave(θ) = ${wave}`;
    spans[1].innerHTML = `<i>f</i> (<i>λe</i>) = ${lives}`;
    spans[2].innerHTML = `(i)<i><sup>x</sup></i> = ${coins}<i>x</i>`;
    spans[3].innerHTML = `<i>Prepare for Wave ${wave}</i>`;
  }
}


function mousePressed() {
  if (selectedTower && mouseX < 800 && mouseY > 0 && mouseY < 600 && mouseX > 0 && gameState === 'wave') {
    let towerCost = unit[selectedTower].cost;
    if (coins >= towerCost) {
      towers.push(new Tower(mouseX, mouseY, selectedTower));
      coins -= towerCost;
    }
  }
}


function startWave() {
  gameState = 'wave';
  wave++;
  spawnEnemies();
  spawnBoss();
}

function spawnEnemies() {
  const enemyTypes = [
    { symbol: '+', health: 20 + wave * 2, speed: 0.8, value: 1, 'damage': 1 },
    { symbol: '−', health: 30 + wave * 2, speed: 0.7, value: 1, 'damage': 1 },
    { symbol: '×', health: 40 + wave * 2, speed: 1.0, value: 1, 'damage': 1 },
    { symbol: '÷', health: 70 + wave * 2, speed: 1.2, value: 1, 'damage': 1 },
    { symbol: '√', health: 50 + wave * 2, speed: 0.5, value: 1, 'damage': 1 },
    { symbol: '∑', health: 100 + wave * 2, speed: 0.3, value: 1, 'damage': 1 },
    { symbol: 'π', health: 30 + wave * 2, speed: 3.14, value: 1, 'damage': 1 },
    { symbol: '∫', health: 200 + wave * 2, speed: 1.3, value: 1, 'damage': 1 },
    { symbol: '(+)', health: 120 + wave * 2, speed: 0.8, value: 1, 'damage': 1 },
    { symbol: '(−)', health: 150 + wave * 2, speed: 0.7, value: 1, 'damage': 1 },
    { symbol: '(×)', health: 180 + wave * 2, speed: 1.0, value: 1, 'damage': 1 },
    { symbol: '(÷)', health: 200 + wave * 2, speed: 1.2, value: 1, 'damage': 1 },
    { symbol: '(√)', health: 250 + wave * 2, speed: 0.5, value: 1, 'damage': 1 },
    { symbol: '(∑)', health: 80 + wave * 2, speed: 0.3, value: 1, 'damage': 1 },
    { symbol: '(π)', health: 30 + wave * 2, speed: 1.5, value: 1, 'damage': 1 },
    { symbol: '∞', health: 170 + wave * 2, speed: 1.3, value: 1, 'damage': 1 },
    { symbol: '∄', health: 55 + wave * 2, speed: 5.6, value: 1, 'damage': 1 },
    { symbol: '≀', health: 30 + wave * 2, speed: 8.2, value: 1, 'damage': 1 },
    { symbol: '≀≀', health: 30 + wave * 2, speed: 8.2, value: 1, 'damage': 1 },
    { symbol: '≀≀≀', health: 30 + wave * 2, speed: 8.2, value: 1, 'damage': 1 },
    { symbol: '⅌', health: 1200 + wave * 2, speed: 0.8, value: 1, 'damage': 1 },
    { symbol: 'ℵ', health: 1500 + wave * 2, speed: 2.4, value: 1, 'damage': 1 },
  ];
  
  for (let i = 0; i < wave * 5; i++) {
    let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    let scaledHealth = type.health;
    enemies.push(new Enemy(type.symbol, scaledHealth, type.speed, type.value, type.damage));
  }
}

class Projectile {
  constructor(x, y, target, damage) {
    this.pos = createVector(x, y);
    this.target = target;
    this.damage = damage;
    this.speed = 9;
    this.updateVelocity();
  }

  update() {
    if (this.target && this.target.health > 0 && this.target.pos) {
      this.updateVelocity();
      this.pos.add(this.vel);
    }
  }

  updateVelocity() {
    if (this.target && this.target.pos) {
      let direction = p5.Vector.sub(this.target.pos, this.pos);
      let distance = direction.mag();
      if (distance > 0) {
        this.vel = direction.normalize().mult(this.speed);
      }
    }
  }

  show() {
    fill('#000000');
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }

  hits() {
    if (!this.target || !this.target.pos || this.target.health <= 0) return false;
    let d = p5.Vector.dist(this.pos, this.target.pos);
    if (d < 10) {
      for (let enemy of enemies) {
        if (enemy.health > 0) {
          let enemyDist = p5.Vector.dist(this.pos, enemy.pos);
          if (enemyDist < 15) {
            enemy.health -= this.damage;
          }
        }
      }
      for (let b of boss) {
        if (b.health > 0) {
          let bossDist = p5.Vector.dist(this.pos, b.pos);
          if (bossDist < 15) {
            b.health -= this.damage;
          }
        }
      }
      return true;
    }
    return false;
  }
}

class Enemy {
  constructor(symbol, health, speed, value, damage) {
    this.pos = path[0].copy();
    this.pathIndex = 0;
    this.symbol = symbol;
    this.health = health;
    this.maxHealth = health;
    this.speed = speed;
    this.value = value;
    this.damage = damage;
  }
  
  update() {
    if (this.pathIndex < path.length - 1) {
      let target = path[this.pathIndex + 1];
      let dir = p5.Vector.sub(target, this.pos).normalize().mult(this.speed);
      this.pos.add(dir);
      if (p5.Vector.dist(this.pos, target) < 5) this.pathIndex++;
    }
  }
  
  show() {
    if (this.symbol === '◉') {
      fill(0);
      textSize(38);
      textStyle(BOLD);
    } else if (this.symbol === '🛆') {
      fill(0);
      textSize(38);
      textStyle(BOLD);
    } else if (this.symbol === '▣') {
      fill(0);
      textSize(38);
      textStyle(BOLD);
    } else if (this.symbol === '✵🌟✵') {
      fill(0);
      textSize(38);
      textStyle(BOLD);
    } else {
      fill(0);
      textSize(20);
      textStyle(NORMAL);
    }
    textFont('my-computer-modern');
    textAlign(CENTER, CENTER);
    text(this.symbol, this.pos.x, this.pos.y);
    noStroke();
    rectMode(CORNER);
    fill(255, 0, 0);
    const maxBarWidth = 50;
    let currentWidth = maxBarWidth * (this.health / this.maxHealth);
    rect(this.pos.x - maxBarWidth / 2, this.pos.y - 30, currentWidth, 5);
  }
  
  reachedEnd() {
    return this.pathIndex >= path.length - 1;
  }
}

class Tower {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.type = type;
    this.label = unit[type].label;
    this.range = unit[type].range;
    this.damage = unit[type].damage;
    this.cooldown = unit[type].cooldown;
    this.timer = 0;
  }
  
  update() {
    if (this.timer > 0) this.timer--;
    let inRange = enemies.filter(enemy => p5.Vector.dist(this.pos, enemy.pos) < this.range);
    inRange = inRange.concat(boss.filter(b => p5.Vector.dist(this.pos, b.pos) < this.range));
    if (inRange.length > 0 && this.timer <= 0) {
      let target = inRange.reduce((closest, current) =>
        p5.Vector.dist(this.pos, closest.pos) < p5.Vector.dist(this.pos, current.pos) ? closest : current);
      if (target) {
        projectiles.push(new Projectile(this.pos.x, this.pos.y, target, this.damage));
        this.timer = this.cooldown;
      }
    }
  }
  
  show() {
    let numberLabel = this.label;
    let size = 30;
    fill(0, 0.1);
    noStroke();
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, size, size, 5);
    fill(255);
    stroke('gray');
    strokeWeight(1);
    rect(this.pos.x, this.pos.y, size, size, 5);
    fill(0);
    textSize(12);
    textFont('my-computer-modern');
    textAlign(CENTER, CENTER);
    text(numberLabel, this.pos.x, this.pos.y);
  }
  
  showRange() {
    stroke(0, 216, 255);
    strokeWeight(0.5);
    drawingContext.setLineDash([5, 5]);
    noFill();
    ellipse(this.pos.x, this.pos.y, this.range * 2, this.range * 2);
    drawingContext.setLineDash([]);
  }
}

window.onload = function() {
  drawMap();
}
