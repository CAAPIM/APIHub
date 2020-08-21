
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const ApiOverviewImage = props => {

    const { image, name, maxHeight } = props;

    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <div>
                <img style={{ maxHeight }}
                    src={`./${image}`}
                    alt={`${name} image`}
                    className={classes.illustration}
                />
            </div>
        </div>
    );
};

const useStyles = makeStyles(() => ({
    illustration: {
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
    },
}));