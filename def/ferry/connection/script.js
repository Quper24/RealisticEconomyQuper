const fs = require("fs");
const path = require("path");

// Функция для обработки каждого файла .sii
function processFile(filePath) {
  // Читаем содержимое файла
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Ошибка при чтении файла ${filePath}:`, err);
      return;
    }

    // Находим строку с `price`
    const regex = /price:\s*(\d+)/;
    const match = data.match(regex);
    let oldprice = 0;
    if (match) {
      let price = parseInt(match[1], 10); // Извлекаем текущее значение price
      oldprice = price; // Логика для изменения значения price
      if (price < 50) {
        price = Math.ceil(price * 0.6);
      } else if (price < 100) {
        price = Math.ceil(price * 0.5);
        if (price < 50) {
          price += 10;
        }
      } else if (price < 200) {
        price = Math.ceil(price * 0.4);
        if (price < 100) {
          price += 25;
        }
      } else if (price < 300) {
        price = Math.ceil(price * 0.3);
        if (price < 200) {
          price += 50;
        }
      } else {
        price = Math.ceil(price * 0.3);
        if (price < 300) {
          price += 100;
        }
      }

      // Заменяем старое значение price на новое
      const newData = data.replace(regex, `price: ${price}`);

      // Записываем изменения обратно в файл
      fs.writeFile(filePath, newData, "utf8", (err) => {
        if (err) {
          console.error(`Ошибка при записи в файл ${filePath}:`, err);
        } else {
          console.log(
            `Файл ${filePath} обновлён. 
            Старо значение price: ${oldprice}
            Новое значение price: ${price}`,
          );
        }
      });
    } else {
      console.log(`В файле ${filePath} не найдена строка с price.`);
    }
  });
}

// Функция для поиска всех .sii файлов в текущей директории
function processAllSiiFiles() {
  const currentDir = __dirname;

  fs.readdir(currentDir, (err, files) => {
    if (err) {
      console.error("Ошибка при чтении директории:", err);
      return;
    }

    // Фильтруем только файлы с расширением .sii и обрабатываем каждый из них
    files
      .filter((file) => path.extname(file) === ".sii")
      .forEach((file) => processFile(path.join(currentDir, file)));
  });
}

// Запускаем обработку всех .sii файлов
processAllSiiFiles();
