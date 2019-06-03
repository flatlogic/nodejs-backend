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
    function generateRandomPicks(minPoint, maxPoint, picksAmount, xMax) {
        let x = 0;
        let y = 0;
        const result = [];
        const xStep = 1;
        const smoothness = 0.3;
        const pointsPerPick = Math.ceil(xMax / ((picksAmount * 2) + 1) / 2);

        const maxValues = [];
        const minValues = [];

        for (let i = 0; i < picksAmount; i += 1) {
            const minResult = minPoint + Math.random();
            const maxResult = maxPoint - Math.random();

            minValues.push(minResult);
            maxValues.push(maxResult);
        }

        let localMax = maxValues.shift(0);
        let localMin = 0;
        let yStep = parseFloat(((localMax - localMin) / pointsPerPick).toFixed(2));

        for (let j = 0; j < Math.ceil(xMax); j += 1) {
            result.push([x, y]);

            if ((y + yStep >= localMax) || (y + yStep <= localMin)) {
                y += yStep * smoothness;
            } else if ((result[result.length - 1][1] === localMax) || (result[result.length - 1][1] === localMin)) {
                y += yStep * smoothness;
            } else {
                y += yStep;
            }

            if (y > localMax) {
                y = localMax;
            } else if (y < localMin) {
                y = localMin;
            }

            if (y === localMin) {
                localMax = maxValues.shift(0) || localMax;

                const share = (localMax - localMin) / localMax;
                const p = share > 0.5 ? Math.round(pointsPerPick * 1.2) : Math.round(pointsPerPick * share);

                yStep = parseFloat(((localMax - localMin) / p).toFixed(2));
                yStep *= Math.abs(yStep);
            }

            if (y === localMax) {
                localMin = minValues.shift(0) || localMin;

                const share = (localMax - localMin) / localMax;
                const p = share > 0.5 ? Math.round(pointsPerPick * 1.5) : Math.round(pointsPerPick * 0.5);

                yStep = parseFloat(((localMax - localMin) / p).toFixed(2));
                yStep *= -1;
            }

            x += xStep;
        }

        return result;
    }

    const d1 = generateRandomPicks(0.2, 3, 4, 90);
    const d2 = generateRandomPicks(0.4, 3.8, 4, 90);
    const d3 = generateRandomPicks(0.2, 4.2, 3, 90);

    return [d1, d2, d3];
}