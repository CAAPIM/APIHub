import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { getFetchJson, useApiHub } from 'layer7-apihub';
import { useLocale, useGetList } from 'ra-core';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import endOfYear from 'date-fns/endOfYear';
import startOfYear from 'date-fns/startOfYear';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import lightGreen from '@material-ui/core/colors/lightGreen';

export const ApiShowMetrics = props => {
    const classes = useStyles();
    const { record, ...rest } = props;
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('lastWeek');
    const [selectedApiForHits, setSelectedApiForHits] = useState(record);
    const [selectedApiForLatency, setSelectedApiForLatency] = useState(record);

    const hitsOptions = useMemo(() => {
        return {
            metric: 'hits',
            timeAggregation: 'day',
            ...getDatesFromTimeRange(timeRange),
        };
    }, [selectedApiForHits, timeRange]);
    const hits = useMetrics(hitsOptions);

    const latenciesOptions = useMemo(() => {
        return {
            metric: 'latency',
            timeAggregation: 'day',
            ...getDatesFromTimeRange(timeRange),
        };
    }, [selectedApiForLatency, timeRange]);
    const latencies = useMetrics(latenciesOptions);

    return (
        <Card component="section">
            <CardContent className={classes.header}>
                <Typography component="h2" variant="h5" color="primary">
                    Overall Traffic & Latency
                </Typography>
                <TimeRangeMenu onChange={setTimeRange} value={timeRange} />
            </CardContent>
            <CardContent className={classes.chartContainer}>
                <div>
                    <Typography component="h3" variant="h6">
                        Traffic (Hits)
                    </Typography>
                    {hits ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={hits.hitsTs.sort(sortByDateAsc)}
                                margin={{
                                    top: theme.spacing(4),
                                    right: 0,
                                    left: 0,
                                    bottom: theme.spacing(4),
                                }}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke={theme.palette.background.default}
                                    strokeOpacity={1}
                                    strokeWidth={1}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={
                                        <MetricTickXLabel
                                            timeRange={timeRange}
                                        />
                                    }
                                />
                                <YAxis
                                    axisLine={false}
                                    padding={{ top: 10, bottom: 10 }}
                                    stroke={theme.palette.background.default}
                                    strokeWidth={1}
                                    tick={<HitsTickYLabel />}
                                    tickSize={50}
                                />
                                <Tooltip
                                    labelStyle={{
                                        fontFamily: theme.typography.fontFamily,
                                    }}
                                    contentStyle={{
                                        fontFamily: theme.typography.fontFamily,
                                    }}
                                    labelFormatter={date =>
                                        format(parseISO(date), 'd MMM')
                                    }
                                    content={
                                        <HitTooltipContent
                                            timeRange={timeRange}
                                        />
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hits"
                                    stroke={theme.palette.secondary.main}
                                    strokeWidth={2}
                                    dot={{ fill: theme.palette.secondary.main }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : null}
                </div>
                <div>
                    <Typography component="h3" variant="h6">
                        Latency (ms)
                    </Typography>
                    {latencies ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart
                                data={latencies.latenciesTs
                                    .sort(sortByDateAsc)
                                    .map(latency => ({
                                        date: latency.date,
                                        avg: [latency.avg, latency.avg],
                                        minMax: [latency.min, latency.max],
                                    }))}
                                margin={{
                                    top: theme.spacing(4),
                                    right: 0,
                                    left: 0,
                                    bottom: theme.spacing(4),
                                }}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke={theme.palette.background.default}
                                    strokeOpacity={1}
                                    strokeWidth={1}
                                />

                                <XAxis
                                    dataKey="date"
                                    tick={
                                        <MetricTickXLabel
                                            timeRange={timeRange}
                                        />
                                    }
                                />
                                <YAxis
                                    axisLine={false}
                                    padding={{ top: 10, bottom: 10 }}
                                    stroke={theme.palette.background.default}
                                    strokeWidth={1}
                                    tick={<LatencyTickYLabel />}
                                    tickSize={50}
                                />
                                <Tooltip
                                    labelStyle={{
                                        fontFamily: theme.typography.fontFamily,
                                    }}
                                    contentStyle={{
                                        fontFamily: theme.typography.fontFamily,
                                    }}
                                    labelFormatter={date =>
                                        format(parseISO(date), 'd MMM')
                                    }
                                    content={
                                        <LatencyTooltipContent
                                            timeRange={timeRange}
                                        />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="minMax"
                                    stroke={theme.palette.secondary.dark}
                                    strokeWidth={0}
                                    fill={theme.palette.secondary.dark}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="avg"
                                    stroke={theme.palette.secondary.main}
                                    strokeWidth={2}
                                    fillOpacity={0}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

function TimeRangeMenu({ onChange, value }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = event => {
        onChange(event.target.getAttribute('data-value'));
        handleClose();
    };

    return (
        <>
            <Button
                aria-label="Select the time range to consider for the metrics"
                aria-controls="period-menu"
                aria-haspopup="true"
                onClick={handleClick}
                endIcon={<MoreVertIcon />}
            >
                {TimeRangeMenuLabels[value]}
            </Button>
            <Menu
                id="period-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    selected={value === 'lastWeek'}
                    data-value="lastWeek"
                    onClick={handleMenuItemClick}
                >
                    Last week
                </MenuItem>
                <MenuItem
                    selected={value === 'lastMonth'}
                    data-value="lastMonth"
                    onClick={handleMenuItemClick}
                >
                    Last month
                </MenuItem>
                <MenuItem
                    selected={value === 'lastYear'}
                    data-value="lastYear"
                    onClick={handleMenuItemClick}
                >
                    Last year
                </MenuItem>
            </Menu>
        </>
    );
}

function ApiFilter({ onChange, value }) {
    const [inputValue, setInputValue] = useState('');
    const classes = useApiFilterStyles();

    const { data, loading } = useGetList(
        'apis',
        {
            perPage: 50,
            page: 0,
        },
        {
            field: 'name',
            order: 'ASC',
        },
        {
            q: inputValue,
        }
    );

    return (
        <Autocomplete
            classes={classes}
            autoComplete
            getOptionLabel={option => option.name || 'All APIs'}
            options={Object.values(data)}
            value={value}
            filterOptions={x => x}
            noOptionsText={loading ? 'Loading APIs' : 'No match'}
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                    }}
                    aria-label="Choose an API"
                    fullWidth
                />
            )}
        />
    );
}

function MetricTickXLabel({ x, y, payload, timeRange }) {
    const theme = useTheme();

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="middle"
                fill={theme.palette.primary.main}
                fontFamily={theme.typography.fontFamily}
            >
                {format(
                    parseISO(payload.value),
                    timeRange === 'lastYear' ? 'd MMM yyyy' : 'd MMM'
                ).toUpperCase()}
            </text>
        </g>
    );
}

function HitsTickYLabel({ x, y, payload }) {
    const theme = useTheme();
    const locale = useLocale();
    const formatter = new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
    });

    return (
        <g transform={`translate(${x},${y - 20})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="start"
                fill={theme.palette.primary.main}
                fontFamily={theme.typography.fontFamily}
            >
                {formatter.format(payload.value)}
            </text>
        </g>
    );
}

function LatencyTickYLabel({ x, y, payload }) {
    const theme = useTheme();
    const locale = useLocale();
    const formatter = new Intl.NumberFormat(locale, {
        notation: 'standard',
        maximumFractionDigits: 0,
    });

    return (
        <g transform={`translate(${x},${y - 20})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="start"
                fill={theme.palette.primary.main}
                fontFamily={theme.typography.fontFamily}
            >
                {formatter.format(payload.value)}
            </text>
        </g>
    );
}

function HitTooltipContent({ payload, label, timeRange }) {
    const classes = useTooltipStyles();

    const locale = useLocale();
    const formatter = new Intl.NumberFormat(locale, {
        notation: 'standard',
    });

    if (!payload || payload.length === 0) {
        return null;
    }

    return (
        <Paper component="ul" className={classes.root}>
            <Typography color="secondary">
                {format(
                    parseISO(label),
                    timeRange === 'lastYear' ? 'd MMM yyyy' : 'd MMM'
                ).toUpperCase()}
            </Typography>
            <Typography>{formatter.format(payload[0].value)} hits</Typography>
        </Paper>
    );
}

function LatencyTooltipContent({ payload, label, timeRange }) {
    const classes = useTooltipStyles();

    const locale = useLocale();
    const formatter = new Intl.NumberFormat(locale, {
        notation: 'standard',
        maximumFractionDigits: 0,
        style: 'unit',
        unit: 'millisecond',
    });

    if (!payload || payload.length === 0 || !payload[0].payload.avg[0]) {
        return null;
    }

    return (
        <Paper component="ul" className={classes.root}>
            <Typography color="secondary">
                {format(
                    parseISO(label),
                    timeRange === 'lastYear' ? 'd MMM yyyy' : 'd MMM'
                ).toUpperCase()}
            </Typography>
            <ul className={classes.list}>
                <li className={classes.li}>
                    <Typography component="span" color="textSecondary">
                        max
                    </Typography>
                    <Typography component="span">
                        {formatter.format(payload[0].payload.minMax[1])}
                    </Typography>
                </li>
                <li className={classes.li}>
                    <Typography component="span" color="textSecondary">
                        avg
                    </Typography>
                    <Typography component="span">
                        {formatter.format(payload[0].payload.avg[0])}
                    </Typography>
                </li>
                <li className={classes.li}>
                    <Typography component="span" color="textSecondary">
                        min
                    </Typography>
                    <Typography component="span">
                        {formatter.format(payload[0].payload.minMax[0])}
                    </Typography>
                </li>
            </ul>
        </Paper>
    );
}

/**
 * Hook which will fetch a metric with provided parameter and update them when parameters change.
 *
 * @param {Object} options Options
 * @param {('hits'|'latency')} options.metric The metric to fetch.
 * @param {Date} options.startDate The start of the period to consider.
 * @param {Date} options.endDate The end of the period to consider.
 * @param {("minute"|"hour"|"day"|"week"|"month"|"hod"|"dow")} options.timeAggregation The time buckets.
 * @param {("hour"|"day"|"week"|"month"|"year"|"custom")} options.timerange The request time range.
 */
export function useMetrics(options) {
    const { urlWithTenant, originHubName } = useApiHub();
    const [data, setData] = useState();
    const url = `${urlWithTenant}/${getMetricsRequest(options)}`;

    useEffect(() => {
        // Use to ensure we don't try to update the state on an unmounted
        // component
        let updateState = true;
        const fetchJson = getFetchJson(originHubName);

        const fetchData = async () => {
            const { json } = await fetchJson(url);

            if (updateState && json.data) {
                setData(json.data);
            }
        };

        fetchData();

        return () => {
            updateState = false;
        };
    }, [originHubName, urlWithTenant, url]);

    return data;
}

/**
 * Function to create a fetch request options object for the metrics API.
 *
 * @param {Object} options Options
 * @param {('hits'|'latency')} options.metric The metric to fetch.
 * @param {Date} options.startDate The start of the period to consider.
 * @param {Date} options.endDate The end of the period to consider.
 * @param {("minute"|"hour"|"day"|"week"|"month"|"hod"|"dow")} options.timeAggregation The time buckets.
 * @param {("hour"|"day"|"week"|"month"|"year"|"custom")} options.timerange The request time range.
 */
export function getMetricsRequest({
    metric,
    startDate,
    endDate,
    timeAggregation,
    timerange = 'custom',
}) {
    const url = `analytics/metrics/v1/${metric}/apis/by-${timeAggregation}?timerange=${timerange}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

    return url;
}

const sortByDateAsc = (a, b) => parseISO(a.date) - parseISO(b.date);

const getDatesFromTimeRange = timeRange => {
    const now = Date.now();

    if (timeRange === 'lastWeek') {
        return {
            startDate: startOfWeek(now),
            endDate: endOfWeek(now),
        };
    }

    if (timeRange === 'lastMonth') {
        return {
            startDate: startOfMonth(now),
            endDate: endOfMonth(now),
        };
    }

    return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
    };
};

const TimeRangeMenuLabels = {
    lastWeek: 'Last week',
    lastMonth: 'Last month',
    lastYear: 'Last year',
};

const useStyles = makeStyles(theme => ({
    header: {
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(4, 2),
        display: 'flex',
        justifyContent: 'space-between',
    },
    chartContainer: {
        display: 'flex',
        marginLeft: -theme.spacing(4),
        marginRight: -theme.spacing(4),
        '& > *': {
            flexBasis: '50%',
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
    },
}));

const useApiFilterStyles = makeStyles(theme => ({
    root: {
        borderLeftStyle: 'solid',
        borderLeftWidth: 2,
        borderLeftColor: lightGreen[600],
        paddingLeft: theme.spacing(1),
        backgroundColor: lightGreen[50],
        maxWidth: '60%',
    },
}));

const useTooltipStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    list: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
    },
    li: {
        display: 'flex',
        margin: 0,
        '& :first-child': {
            marginRight: theme.spacing(1),
        },
    },
}));
