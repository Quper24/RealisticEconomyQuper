const fs = require("fs");
const path = require("path");

// Функция для округления до десятков
function roundToNearestTen(value) {
  return Math.round(value / 10) * 10;
}

// Функция для генерации нового значения цены
function generateNewPrice(oldPrice) {
  let newPrice;
  if (oldPrice <= 5000) {
    newPrice = Math.random() * (3000 - 1500) + 1500; // от 1500 до 3000
  } else if (oldPrice > 5000 && oldPrice <= 10000) {
    newPrice = Math.random() * (5000 - 3000) + 3000; // от 3000 до 5000
  } else {
    newPrice = Math.random() * (7000 - 5000) + 5000; // от 5000 до 7000
  }
  return roundToNearestTen(newPrice);
}

// Рекурсивная функция для обхода файлов
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Если это директория, рекурсивно обрабатываем её
      processDirectory(filePath);
    } else if ([".sui", ".sii"].includes(path.extname(file).toLowerCase())) {
      // Если это файл с расширением .sui или .sii
      let content = fs.readFileSync(filePath, "utf8");

      // Ищем все вхождения "price:" и меняем значения
      content = content.replace(/price:\s*(\d+)/g, (match, price) => {
        const oldPrice = parseInt(price, 10);
        const newPrice = generateNewPrice(oldPrice);
        console.log(`Updated price in ${filePath}: ${oldPrice} -> ${newPrice}`);
        return `price: ${newPrice}`;
      });

      // Перезаписываем файл с обновленным содержимым
      fs.writeFileSync(filePath, content, "utf8");
    }
  });
}

// Начинаем обработку с текущей директории
const currentDirectory = process.cwd();
console.log(`Processing files in directory: ${currentDirectory}`);
processDirectory(currentDirectory);
console.log("Processing complete.");
