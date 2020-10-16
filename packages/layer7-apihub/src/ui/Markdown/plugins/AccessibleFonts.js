import React from 'react';
import { useTranslate } from 'ra-core';
import { PluginComponent } from 'react-markdown-editor-lite';

import Button from '@material-ui/core/Button';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatStrikethroughIcon from '@material-ui/icons/FormatStrikethrough';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import WrapTextIcon from '@material-ui/icons/WrapText';
import CodeIcon from '@material-ui/icons/Code';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

const FontButton = props => {
    const { type, onClick, children } = props;
    const translate = useTranslate();

    const handleClick = () => onClick(type);

    return (
        <Button
            className="button"
            title={translate(`apihub.markdown_editor.fonts.${type}`)}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
};

export default class AccessibleFonts extends PluginComponent {
    static pluginName = 'accessible-fonts';

    render() {
        const handleClick = type => {
            this.editor.insertMarkdown(type);
        };

        return (
            <>
                <FontButton type="bold" onClick={handleClick}>
                    <FormatBoldIcon fontSize="small" />
                </FontButton>
                <FontButton type="italic" onClick={handleClick}>
                    <FormatItalicIcon fontSize="small" />
                </FontButton>
                <FontButton type="strikethrough" onClick={handleClick}>
                    <FormatStrikethroughIcon fontSize="small" />
                </FontButton>
                <FontButton type="unordered" onClick={handleClick}>
                    <FormatListBulletedIcon fontSize="small" />
                </FontButton>
                <FontButton type="order" onClick={handleClick}>
                    <FormatListNumberedIcon fontSize="small" />
                </FontButton>
                <FontButton type="quote" onClick={handleClick}>
                    <FormatQuoteIcon fontSize="small" />
                </FontButton>
                <FontButton type="hr" onClick={handleClick}>
                    <WrapTextIcon fontSize="small" />
                </FontButton>
                <FontButton type="inlinecode" onClick={handleClick}>
                    <CodeIcon fontSize="small" />
                </FontButton>
                <FontButton type="code" onClick={handleClick}>
                    <SettingsEthernetIcon fontSize="small" />
                </FontButton>
            </>
        );
    }
}
