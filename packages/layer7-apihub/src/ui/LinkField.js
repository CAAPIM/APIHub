import React from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Link from '@material-ui/core/Link';

export const LinkField = pure(
    ({ addLabel = true, className, source, record = {}, ...rest }) => {
        const value = get(record, source);
        if (!value) {
            return null;
        }
        return (
            <Link className={className} href={value} {...rest}>
                {value}
            </Link>
        );
    }
);
