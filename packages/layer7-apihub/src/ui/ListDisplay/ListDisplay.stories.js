import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {
    ListDisplayButton,
    ListDisplayProvider,
    LIST_DISPLAY_CARDS,
    useListDisplay,
} from './';

export default {
    title: 'UI/ListDisplay',
};

const ListDisplay = () => {
    const [display] = useListDisplay();

    if (display === LIST_DISPLAY_CARDS) {
        return <SimpleCardList />;
    }

    return <SimpleDatagrid />;
};

const useStyles = makeStyles(theme => ({
    toolbar: {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
    },
}));

export const Default = () => {
    const classes = useStyles();
    return (
        <ListDisplayProvider preferenceName="storybook">
            <div className={classes.toolbar}>
                <ListDisplayButton />
            </div>
            <div>
                <ListDisplay />
            </div>
        </ListDisplayProvider>
    );
};

// Helper methods and components

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useSimpleCardListStyles = makeStyles(theme => ({
    root: {
        minWidth: 275,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        minWidth: 100,
        '& > p': {
            fontWeight: 'bold',
        },
    },
}));

function SimpleCardList() {
    const classes = useSimpleCardListStyles();

    return (
        <Grid container spacing={4}>
            {rows.map(row => (
                <Grid item>
                    <Card className={classes.root}>
                        <CardHeader
                            className={classes.title}
                            color="textSecondary"
                            title={row.name}
                            subheader="100g serving"
                            gutterBottom
                        ></CardHeader>
                        <CardContent>
                            <Grid spacing="1" container>
                                <Grid className={classes.header} item>
                                    <Typography component="p">
                                        Calories:
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{row.calories}</Typography>
                                </Grid>
                            </Grid>
                            <Grid spacing="1" container>
                                <Grid className={classes.header} item>
                                    <Typography component="p">
                                        Fat&nbsp;:
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{row.fat}g</Typography>
                                </Grid>
                            </Grid>
                            <Grid spacing="1" container>
                                <Grid className={classes.header} item>
                                    <Typography component="p">
                                        Carbs&nbsp;:
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{row.carbs}g</Typography>
                                </Grid>
                            </Grid>
                            <Grid spacing="1" container>
                                <Grid className={classes.header} item>
                                    <Typography component="p">
                                        Protein&nbsp;:
                                    </Typography>
                                </Grid>
                                <Grid item alignContent="flex-end">
                                    <Typography>{row.protein}g</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

const useSimpleDatagridStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function SimpleDatagrid() {
    const classes = useSimpleDatagridStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
