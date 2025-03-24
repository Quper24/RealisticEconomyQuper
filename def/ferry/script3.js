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

function calculatePrice(distance) {
  const basePrice = 20; // Базовая цена
  const pricePerKm = 0.1; // Цена за километр

  return parseInt(basePrice + distance * pricePerKm);
}

console.log(calculatePrice(645));

// Функция для расчета времени парома
function calculateFerryTime(distance) {
  const maxSpeed = 40; // км/ч (крейсерская скорость)
  const acceleration = 0.2; // м/с² (ускорение и торможение)

  // Перевод скорости в м/с
  const maxSpeedMS = (maxSpeed * 1000) / 3600;

  // Расчет расстояния разгона и торможения (s = v² / 2a)
  const accelDistance = maxSpeedMS ** 2 / (2 * acceleration) / 1000; // км

  // Время разгона и торможения (t = v / a)
  const accelTime = maxSpeedMS / acceleration / 60; // в минутах

  // Проверка, достаточно ли расстояния для выхода на крейсерскую скорость
  if (distance <= 2 * accelDistance) {
    // Если расстояние слишком мало, то считаем, что паром не достигает крейсерской скорости
    const adjustedTime = Math.sqrt((2 * distance * 1000) / acceleration) / 60;
    return adjustedTime.toFixed(2); // Возвращаем время в минутах
  }

  // Расстояние на крейсерской скорости
  const cruiseDistance = distance - 2 * accelDistance;

  // Время на крейсерской скорости (t = s / v)
  const cruiseTime = (cruiseDistance / maxSpeed) * 60; // в минутах

  // Итоговое время
  const totalTime = accelTime * 2 + cruiseTime;
  return totalTime.toFixed(0); // Возвращаем время в минутах
}

// Главная функция
function main() {
  const inputFilePath = "./fixed_data.json"; // Укажите путь к вашему файлу
  const outputFilePath = "./updated_ferry_routes.json"; // Файл для сохранения исправленных данных

  try {
    // Читаем исходные данные
    const inputData = readJsonFile(inputFilePath);

    // Обновляем значения time для каждого маршрута
    const updatedData = {};
    for (const key in inputData) {
      if (inputData.hasOwnProperty(key)) {
        const route = inputData[key];
        const newTime = calculateFerryTime(route.distance);
        const newPrice = calculatePrice(route.distance);
        updatedData[key] = {
          ...route,
          time: parseFloat(newTime),
          price: newPrice,
        }; // Обновляем время
      }
    }

    // Сохраняем исправленные данные в новый файл
    writeJsonFile(outputFilePath, updatedData);

    console.log(
      `Исправленные данные успешно сохранены в файл: ${outputFilePath}`,
    );
  } catch (error) {
    console.error("Произошла ошибка:", error.message);
  }
}

main();
