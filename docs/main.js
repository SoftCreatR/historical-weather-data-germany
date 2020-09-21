'use strict';

const xhr = new XMLHttpRequest();
const weather = [];

xhr.open('GET', 'assets/data.txt');
xhr.send();
xhr.onload = function () {
    xhr.response
        .split('\n')
        .filter(d => d)
        .splice(-30)
        .forEach(day => {
            const xhr2 = new XMLHttpRequest();

            xhr2.open('GET', `assets/data/${day}.json`);
            xhr2.send();
            xhr2.onload = function () {
                weather.push({
                    date: day,
                    mmdd: day.substring(4, 6) + '/' + day.slice(-2),
                    data: JSON.parse(xhr2.response)
                });
            };
        });
};

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
                    backgroundColor: 'rgba(255, 255, 255, .75)',
                    borderColor: 'rgba(222, 222, 222, .75)',
                    borderWidth: 1,
                    data: results.map(x => Math.round(x.data.main.temp)),
                    fill: false,
                    cubicInterpolationMode: 'monotone'
                },
                {
                    label: 'Min (\u{2103})',
                    backgroundColor: 'rgba(52, 100, 189, .75)',
                    borderColor: 'rgba(26, 100, 163, .75)',
                    borderWidth: 1,
                    data: results.map(x => Math.round(x.data.main.temp_min)),
                    fill: false,
                    cubicInterpolationMode: 'monotone'
                },
                {
                    label: 'Max (\u{2103})',
                    backgroundColor: 'rgba(189, 52, 52, .75)',
                    borderColor: 'rgba(163, 26, 26, .75)',
                    borderWidth: 1,
                    data: results.map(x => Math.round(x.data.main.temp_max)),
                    fill: false,
                    cubicInterpolationMode: 'monotone'
                },
            ]
        }
    });
}, 1000);
