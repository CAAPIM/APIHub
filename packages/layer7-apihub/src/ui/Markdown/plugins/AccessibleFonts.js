// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { PluginComponent } from 'react-markdown-editor-lite';

import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import WrapTextIcon from '@mui/icons-material/WrapText';
import CodeIcon from '@mui/icons-material/Code';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';

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
