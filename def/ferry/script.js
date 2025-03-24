const fs = require("fs");
const path = require("path");

// Путь к папке connection
const connectionDir = path.join(__dirname, "connection");

// Регулярные выражения для парсинга данных
const ferryConnectionRegex = /ferry_connection\s*:\s*(\S+)\s+\{/;
const priceRegex = /price\s*:\s*(\d+)/;
const timeRegex = /time\s*:\s*(\d+)/;
const distanceRegex = /distance\s*:\s*(\d+)/;

// Функция для чтения и обработки файлов
async function processFiles() {
  try {
    // Чтение всех файлов с расширением .sii
    const files = await fs.promises.readdir(connectionDir);
    const siiFiles = files.filter((file) => path.extname(file) === ".sii");

    const result = {};

    for (const file of siiFiles) {
      const filePath = path.join(connectionDir, file);
      const data = await fs.promises.readFile(filePath, "utf8");

      // Извлечение имени ferry_connection
      const ferryConnectionMatch = data.match(ferryConnectionRegex);
      if (!ferryConnectionMatch) continue;

      const ferryConnectionName = ferryConnectionMatch[1];

      // Извлечение price, time и distance
      const priceMatch = data.match(priceRegex);
      const timeMatch = data.match(timeRegex);
      const distanceMatch = data.match(distanceRegex);

      if (priceMatch && timeMatch && distanceMatch) {
        const price = parseInt(priceMatch[1], 10);
        const time = parseInt(timeMatch[1], 10);
        const distance = parseInt(distanceMatch[1], 10);

        // Добавление данных в результат
        result[ferryConnectionName] = { price, time, distance };
      }
    }

    // Запись результата в JSON-файл
    const outputFilePath = path.join(__dirname, "output.json");
    await fs.promises.writeFile(
      outputFilePath,
      JSON.stringify(result, null, 2),
      "utf8",
    );

    console.log(`JSON файл успешно создан: ${outputFilePath}`);
  } catch (error) {
    console.error("Ошибка при обработке файлов:", error);
  }
}

// Запуск обработки
processFiles();
