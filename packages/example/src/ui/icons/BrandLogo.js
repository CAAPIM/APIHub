import React from 'react';

export const BrandLogo = props => {
    let path = props.img || 'logo.png';
    return <img className={props.className} src={path} alt={'Logo'} />;
};
