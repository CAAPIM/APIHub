import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import developerCenter from './mapfre_main.jpg';

export const ApisHeader = props => {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <div>
                <img
                    src={developerCenter}
                    alt="Developer Center illustration"
                    className={classes.illustration}
                />
            </div>
        </div>
    );
};

const useStyles = makeStyles(() => ({
    illustration: {
        height: '313px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
    },
}));
