// Функция для вычисления XP по кубической формуле
function calculateXP(level, a, b, c) {
  return a + b * level ** 2 + c * level ** 3;
}

// Параметры
const a = 200;
const b = 20;
const c = 3;

// Вычисление XP для уровней с 0 по 29
for (let level = 0; level <= 29; level++) {
  const xp = calculateXP(level, a, b, c);
  console.log(`level_xp[${level}]: ${xp}`);
}
