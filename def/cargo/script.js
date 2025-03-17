const fs = require("fs");
const path = require("path");

// Функция для рекурсивного поиска файлов
function findFiles(dir, extensions) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Если это директория, рекурсивно ищем файлы внутри неё
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.includes(path.extname(file).toLowerCase())) {
      // Если это файл с нужным расширением, добавляем его путь
      results.push(filePath);
    }
  });

  return results;
}

// Функция для извлечения уникальных значений body_type[]
function extractBodyTypes(files) {
  const uniqueBodyTypes = new Set();

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line) => {
      // Ищем строки с body_type[]: или body_types[]:
      const match = line.match(/^\s*body_types?\[\]:\s*(\w+)/);
      if (match) {
        const bodyType = match[1].trim();
        uniqueBodyTypes.add(bodyType);
      }
    });
  });

  return Array.from(uniqueBodyTypes);
}

// Главная функция
function main() {
  // Текущая директория, где находится скрипт
  const directory = __dirname; // Путь к текущей директории
  const extensions = [".sui", ".sii"]; // Расширения файлов для поиска

  console.log(`Поиск файлов в директории: ${directory}`);

  // Находим все файлы
  const files = findFiles(directory, extensions);

  if (files.length === 0) {
    console.log("Файлы с расширением .sui или .sii не найдены.");
    return;
  }

  console.log(`Найдено файлов: ${files.length}`);

  // Извлекаем уникальные значения body_type[]
  const bodyTypes = extractBodyTypes(files);

  // Выводим результат
  console.log("Уникальные значения body_type[]:");
  console.log(bodyTypes);

  // Сохраняем результат в файл (опционально)
  fs.writeFileSync(
    path.join(directory, "unique_body_types.txt"),
    bodyTypes.join("\n"),
    "utf-8",
  );
  console.log("Результат сохранён в unique_body_types.txt");
}

main();
