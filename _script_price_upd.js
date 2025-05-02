const fs = require("fs");
const path = require("path");

// Функция для обновления значений fuel_price в .sui файлах
function updateSuiFiles() {
  const currentDir = __dirname; // Текущая директория
  const countryFilePath = path.join(currentDir, "_country.txt"); // Путь к файлу _country.txt

  // Чтение содержимого файла _country.txt
  fs.readFile(countryFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Ошибка при чтении файла _country.txt:", err);
      return;
    }

    // Разбиваем данные на строки
    const lines = data.trim().split("\n");

    // Обрабатываем каждую строку
    lines.forEach((line) => {
      // Убираем комментарии (всё после символа #)
      const cleanLine = line.split("#")[0].trim();

      // Парсим строку: greenland - "Kalaallit Nunaat" - 0,61
      const [fileName, nameQuoted, fuelPrice] = cleanLine.split(" - ");
      const newFuelPrice = parseFloat(fuelPrice.replace(",", ".")); // Преобразуем запятую в точку и парсим число

      if (!fileName || isNaN(newFuelPrice)) {
        console.warn(`Некорректная строка: ${line}`);
        return;
      }

      // Определяем путь к .sui файлу
      const suiFilePath = path.join(
        currentDir,
        "def",
        "country",
        `${fileName}.sui`,
      );

      // Проверяем существование файла
      if (!fs.existsSync(suiFilePath)) {
        console.warn(`Файл не найден: ${suiFilePath}`);
        return;
      }

      // Читаем содержимое .sui файла
      let content = fs.readFileSync(suiFilePath, "utf-8");

      // Ищем и заменяем значение fuel_price
      const updatedContent = content.replace(
        /fuel_price:\s*[\d.,]+/,
        `fuel_price: ${newFuelPrice}`,
      );

      // Записываем обновленное содержимое обратно в файл
      fs.writeFileSync(suiFilePath, updatedContent, "utf-8");
      console.log(`Обновлено: ${suiFilePath} -> fuel_price: ${newFuelPrice}`);
    });
  });
}

// Запуск обновления файлов
updateSuiFiles();
