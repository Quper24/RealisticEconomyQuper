const calculateProfit = (salaryFree, distance, salary) => {
  console.log("----------РАСЧЕТ----------");

  const costDiesel = 1.52;
  console.log("Цена на топливо: ", costDiesel);
  const diesel1km = 0.35;
  console.log("Расход на км: ", diesel1km);
  const rubE = 140;

  const expenses = Math.round(distance * diesel1km * costDiesel * rubE);
  console.log("Расходы на топливо: ", expenses);

  const profit = salary - expenses;
  console.log("profit без грузовика: ", salaryFree);
  console.log("profit с грузовиком: ", profit);
};
calculateProfit(22960, 238, 66080);
calculateProfit(78540, 430, 195720);
calculateProfit(9100, 402, 33460);
