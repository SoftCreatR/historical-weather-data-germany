'use strict';

let weather = [];

const fetchDataList = async file => {
  const response = await fetch('assets/data.txt');

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.text();
}

const fetchDailyData = async day => {
  const response = await fetch(`assets/data/${day}.json` );

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

fetchDataList()
  .then(dataList => {
    dataList
      .split('\n')
      .filter(d => d)
      .splice(-30)
      .forEach(day => {
        fetchDailyData(day)
          .then(data => {
            weather.push({
              date: day,
              mmdd: day.substring(4, 6) + '/' + day.slice(-2),
              data: data
            });
          });
      });
  });

setTimeout(() => {
  const results = weather.sort((a, b) => a.date - b.date);
  const labels = results.map(x => x.mmdd);
  const ctx = document.getElementById('myChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temp (\u{2103})',
          backgroundColor: 'rgb(237, 78, 78)',
          borderColor: 'rgba(255, 0, 0, .75)',
          borderWidth: 1,
          data: results.map(x => Math.round(x.data.main.temp)),
          fill: false,
          cubicInterpolationMode: 'monotone'
        },
        {
          label: 'Max (\u{2103})',
          backgroundColor: 'rgba(34, 34, 34, 1)',
          borderColor: 'rgba(0, 0, 0, .75)',
          borderWidth: 1,
          data: results.map(x => Math.round(x.data.main.temp_max)),
          fill: false,
          cubicInterpolationMode: 'monotone'
        },
        {
          label: 'Min (\u{2103})',
          backgroundColor: 'rgb(210, 190, 42)',
          borderColor: 'rgba(122, 122, 31, .75)',
          borderWidth: 1,
          data: results.map(x => Math.round(x.data.main.temp_min)),
          fill: false,
          cubicInterpolationMode: 'monotone'
        }
      ]
    }
  });
}, 1000);
