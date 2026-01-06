let boss1wave = 7;
let boss2wave = 14;
let boss3wave = 21;
let boss4wave = 28;
let bossHPMultiplier = 1

function deleteText() {
  document.getElementById("boss-text").textContent = "";
}

function bossUpgrade() {
  bossHPMultiplier * 3;
}

function spawnBoss() {
  if (wave === boss1wave) {
    boss.push(new Enemy('◉', 3200 * bossHPMultiplier, 0.15, 1500, 300));
    document.getElementById("boss-text").textContent = "Boss: Circulando";
    boss1wave += 28;
    setTimeout(deleteText, 5000);
  } else if (wave === boss2wave) {
    boss.push(new Enemy('🛆', 5700 * bossHPMultiplier, 0.15, 2000, 300));
    document.getElementById("boss-text").textContent = "Boss: Triangelo";
    boss2wave += 28;
    setTimeout(deleteText, 5000);
  } else if (wave === boss3wave) {
    boss.push(new Enemy('▣', 8600 * bossHPMultiplier, 0.15, 4500, 300));
    document.getElementById("boss-text").textContent = "Boss: Quadralith";
    boss3wave += 28;
    setTimeout(deleteText, 5000);
  } else if (wave === boss4wave) {
    boss.push(new Enemy('✵🌟✵', 12400 * bossHPMultiplier, 0.15, 1000, 300));
    document.getElementById("boss-text").textContent = "Boss: Legendary Star (Final Boss)";
    boss4wave += 28;
    setTimeout(deleteText, 5000);
  }
}


