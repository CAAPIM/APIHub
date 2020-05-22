import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Sync } from '@material-ui/icons';

import { useApiHubPreference } from './';

export default {
    title: 'Preferences/Examples',
};

const useStyles = makeStyles(theme => ({
    toolbar: {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
    },
}));

export const DatagridSize = () => {
    const classes = useStyles();

    const [sizePreference, writeSizePreference] = useApiHubPreference(
        'size',
        'small'
    );

    const handleChangeSizePreference = () => {
        writeSizePreference(sizePreference === 'small' ? 'medium' : 'small');
    };

    return (
        <>
            <div className={classes.toolbar}>
                <Button
                    color="primary"
                    startIcon={<Sync />}
                    onClick={handleChangeSizePreference}
                >
                    Change Size
                </Button>
            </div>
            <SimpleDatagridWithPreferences />
        </>
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

const useSimpleDatagridStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function SimpleDatagrid(props) {
    const classes = useSimpleDatagridStyles(props);
    const { size } = props;

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size={size}>
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

function SimpleDatagridWithPreferences(props) {
    const [sizePreference] = useApiHubPreference('size');

    return <SimpleDatagrid {...props} size={sizePreference} />;
}
