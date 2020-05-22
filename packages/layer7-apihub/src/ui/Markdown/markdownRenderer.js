import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import removeMarkdown from 'remove-markdown';
import merge from 'lodash/merge';

export const removeTags = text => {
    return removeMarkdown(text);
};

// TODO: complete supported markdown syntax
const markdownOptions = {
    remarkReactComponents: {
        h1: props => <Typography variant="h1" {...props} />,
        h2: props => <Typography variant="h2" {...props} />,
        h3: props => <Typography variant="h3" {...props} />,
        h4: props => <Typography variant="h4" {...props} />,
        h5: props => <Typography variant="h5" {...props} />,
        h6: props => <Typography variant="h6" {...props} />,
        p: props => <Typography component="p" variant="body1" {...props} />,
        a: props => <Link {...props} />,
        li: props => <Typography component="li" variant="body1" {...props} />,
        td: props => <Typography component="td" variant="body1" {...props} />,
        code: props => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const classes = useMarkdownStyles();
            return (
                <Typography
                    component="code"
                    variant="body1"
                    className={classes.code}
                    {...props}
                />
            );
        },
    },
};

const useMarkdownStyles = makeStyles(theme => ({
    code: {
        fontFamily: 'initial',
        backgroundColor: theme.palette.grey['300'],
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
    },
}));

export const markdownRenderer = (text, options = {}) =>
    unified()
        .use(parse)
        .use(remark2react, merge({}, markdownOptions, options))
        .processSync(text).contents;
