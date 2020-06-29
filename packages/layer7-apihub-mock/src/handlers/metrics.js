import differenceInDays from 'date-fns/differenceInDays';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import parseISO from 'date-fns/parseISO';

export function getMetricsHits(database) {
    return async (schema, request) => {
        const { startDate, endDate } = request.queryParams;
        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);
        const diff = Math.abs(differenceInDays(parsedStartDate, parsedEndDate));

        let hitsTs;

        if (diff > 31) {
            hitsTs = eachMonthOfInterval({
                start: parsedStartDate,
                end: parsedEndDate,
            }).map(date => ({
                date,
                hits: Math.floor(Math.random() * 5000 + 2000),
            }));
        } else {
            hitsTs = eachDayOfInterval({
                start: parsedStartDate,
                end: parsedEndDate,
            }).map(date => ({
                date,
                hits: Math.floor(Math.random() * 200 + 100),
            }));
        }

        const hits = hitsTs.reduce((acc, currentHit) =>
            currentHit > acc ? currentHit : acc
        );

        return {
            respCode: 200,
            respMsg: 'Request Processed Successfully',
            requestId: 'Gen-ad1d18f8-8ada-4e06-97fb-eedc715f84bd',
            query: {
                timerange: 'custom',
                startTimeGMT: startDate,
                endTimeGMT: endDate,
                sortby: 'hits(default)',
                sortorder: 'asc(default)',
            },
            data: {
                hits: { hits },
                hitsTs,
            },
        };
    };
}

export function getMetricsLatency(database) {
    return async (schema, request) => {
        const { startDate, endDate } = request.queryParams;
        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);
        const diff = Math.abs(differenceInDays(parsedStartDate, parsedEndDate));

        let latenciesTs;

        const getLatency = date => {
            const min = Math.floor(Math.random() * 100);
            const max = Math.floor(Math.random() * 100 + 300);

            return {
                date,
                avg: (min + max) / 2,
                min,
                max,
            };
        };

        if (diff > 31) {
            latenciesTs = eachMonthOfInterval({
                start: parsedStartDate,
                end: parsedEndDate,
            }).map(getLatency);
        } else {
            latenciesTs = eachDayOfInterval({
                start: parsedStartDate,
                end: parsedEndDate,
            }).map(getLatency);
        }

        const latencies = {
            max: latenciesTs.reduce((acc, latency) =>
                latency.max > acc ? latency.max : acc
            ),
            min: latenciesTs.reduce((acc, latency) =>
                latency.min < acc ? latency.min : acc
            ),
            avg:
                latenciesTs.reduce((acc, latency) => acc + latency.avg) /
                latenciesTs.length,
        };

        return {
            respCode: 200,
            respMsg: 'Request Processed Successfully',
            requestId: 'Gen-89ecd7b4-6a90-48d4-8e2b-630b3f86d12d',
            query: {
                stats: 'avg,max,min',
                timerange: 'custom',
                startTimeGMT: '2020-01-05T00:00:00(default)',
                endTimeGMT: '2020-01-11T23:59:59(default)',
                sortby: 'avg(default)',
                sortorder: 'asc(default)',
            },
            data: {
                latencies,
                latenciesTs,
            },
        };
    };
}
