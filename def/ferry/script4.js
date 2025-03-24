const fs = require("fs");
const path = require("path");

// Путь к папке с .sii файлами
const siiFolderPath = "./connection";
// Путь к JSON файлу
const jsonFilePath = "./connections.json";

// Чтение JSON файла
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

// Функция для обновления .sii файла
function updateSiiFile(filePath, connectionName) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Ищем строки price, time и distance
  const updatedContent = fileContent
    .replace(
      /(price:\s*)(\d+)/,
      (_, prefix) => `${prefix}${jsonData[connectionName].price}`,
    )
    .replace(
      /(time:\s*)(\d+)/,
      (_, prefix) => `${prefix}${jsonData[connectionName].time}`,
    )
    .replace(
      /(distance:\s*)(\d+)/,
      (_, prefix) => `${prefix}${jsonData[connectionName].distance}`,
    );

  // Перезаписываем файл с обновленным содержимым
  fs.writeFileSync(filePath, updatedContent, "utf8");
}

// Основная функция
function processSiiFiles() {
  // Читаем все файлы в папке
  fs.readdir(siiFolderPath, (err, files) => {
    if (err) {
      console.error("Ошибка при чтении папки:", err);
      return;
    }

    // Фильтруем только .sii файлы
    const siiFiles = files.filter((file) => path.extname(file) === ".sii");

    siiFiles.forEach((file) => {
      const filePath = path.join(siiFolderPath, file);

      // Читаем содержимое файла
      const fileContent = fs.readFileSync(filePath, "utf8");

      // Ищем строку ferry_connection
      const match = fileContent.match(/ferry_connection\s*:\s*([^\s{]+)/);
      if (match) {
        const connectionName = match[1].trim();

        // Проверяем, есть ли такое свойство в JSON
        if (jsonData[connectionName]) {
          console.log(
            `Обновление файла: ${file} для соединения: ${connectionName}`,
          );
          updateSiiFile(filePath, connectionName);
        } else {
          console.warn(
            `Соединение ${connectionName} не найдено в JSON для файла: ${file}`,
          );
        }
      } else {
        console.warn(`Строка ferry_connection не найдена в файле: ${file}`);
      }
    });
  });
}

// Запуск обработки
processSiiFiles();
