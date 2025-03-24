const fs = require("fs");

// Функция для чтения JSON из файла
function readJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

// Функция для записи JSON в файл
function writeJsonFile(filePath, data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, "utf8");
}

// Основная функция для исправления несоответствий
function fixInconsistencies(data) {
  const correctedData = {};
  const processedPairs = new Set(); // Для отслеживания уже обработанных пар

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const [_, city1, city2] = key.split(".");
      const reverseKey = `conn.${city2}.${city1}`;

      // Если обратный маршрут существует и пара ещё не обработана
      if (data[reverseKey] && !processedPairs.has(`${city1}-${city2}`)) {
        const route1 = data[key];
        const route2 = data[reverseKey];

        // Выбираем минимальное расстояние
        const minDistance = Math.min(route1.distance, route2.distance);

        // Обновляем оба маршрута с минимальным расстоянием
        correctedData[key] = { ...route1, distance: minDistance };
        correctedData[reverseKey] = { ...route2, distance: minDistance };

        // Помечаем пару как обработанную
        processedPairs.add(`${city1}-${city2}`);
        processedPairs.add(`${city2}-${city1}`);
      } else if (!processedPairs.has(`${city1}-${city2}`)) {
        // Если обратного маршрута нет, просто копируем текущий
        correctedData[key] = data[key];
      }
    }
  }

  return correctedData;
}

// Главная функция
function main() {
  const inputFilePath = "output.json"; // Укажите путь к вашему файлу
  const outputFilePath = "fixed_data.json"; // Файл для сохранения исправленных данных

  try {
    // Читаем исходные данные
    const inputData = readJsonFile(inputFilePath);

    // Исправляем несоответствия
    const fixedData = fixInconsistencies(inputData);

    // Сохраняем исправленные данные в новый файл
    writeJsonFile(outputFilePath, fixedData);

    console.log(
      `Исправленные данные успешно сохранены в файл: ${outputFilePath}`,
    );
  } catch (error) {
    console.error("Произошла ошибка:", error.message);
  }
}

main();
