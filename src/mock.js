export default {
    analytics: {
        visits: {
            count: 4.332,
            logins: 830,
            sign_out_pct: 0.5,
            rate_pct: 4.5
        },
        performance: {
            sdk: {
                this_period_pct: 60,
                last_period_pct: 30,
            },
            integration: {
                this_period_pct: 40,
                last_period_pct: 55,
            }
        },
        server: {
            1: {
                pct: 60,
                temp: 37,
                frequency: 3.3
            },
            2: {
                pct: 54,
                temp: 31,
                frequency: 3.3
            }
        },
        revenue: getRevenueData(),
        mainChart: getMainChartData()
    }
}

function getRevenueData() {
    const data = [];
    const seriesCount = 3;
    const accessories = ['SMX', 'Direct', 'Networks'];

    for (let i = 0; i < seriesCount; i += 1) {
        data.push({
            label: accessories[i],
            data: Math.floor(Math.random() * 100) + 1,
        });
    }

    return data;
}

function getMainChartData() {
  function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
    var array = new Array(length).fill();
    let lastValue;

    return array.map((item, index) => {
      let randomValue = Math.floor(Math.random() * multiplier + 1);

      while (
        randomValue <= min ||
        randomValue >= max ||
        (lastValue && randomValue - lastValue > maxDiff)
        ) {
        randomValue = Math.floor(Math.random() * multiplier + 1);
      }

      lastValue = randomValue;

      return [index, randomValue];
    });
  }

  const d1 = getRandomData(31, 3500, 6500, 7500, 1000);
  const d2 = getRandomData(31, 1500, 7500, 7500, 1500);
  const d3 = getRandomData(31, 1500, 7500, 7500, 1500);
  return [d1, d2, d3];
}
