// Функция для вычисления XP по линейной формуле
function linearXP(level, a, b) {
  return a + b * level;
}

// Параметры
const a = 200; // XP на уровне 0
const b = 6600 / 29; // Прирост XP на каждом уровне

// Вывод XP для уровней с 0 по 29 с округлением до ближайших 100
for (let level = 0; level <= 29; level++) {
  const xp = linearXP(level, a, b);
  console.log(`level_xp[${level}]: ${Math.round(xp / 100) * 100}`);
}
