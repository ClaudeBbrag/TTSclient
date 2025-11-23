import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { isDesktopApp } from "../../util/isDesctopApp";
import { FaQuestionCircle, FaCog } from "react-icons/fa";
import {
    button,
    headerArea,
    iconArea,
    iconGroup,
    title,
    titleArea,
    titleVersion,
    tooltip,
    tooltipText,
    tooltipText100px,
} from "../../styles/header.css";
import { useAppRoot } from "../../001_AppRootProvider";
import { useGuiState } from "../GuiStateProvider";
import { useAppState } from "../../002_AppStateProvider";
import { Logger } from "../../util/logger";
import { HeaderIcon } from "../../styles/style-components/icons/01_header-icon.css";
import { BasicButton } from "../../styles/style-components/buttons/01_basic-button.css";
import { BasicInput } from "../../styles/style-components/inputs/01_basic-input.css";
import { headerButtonThema } from "../../styles/style-components/buttons/thema/button-thema.css";
import { Dropdown, DropdownItem } from "../common/Dropdown";

export type HeaderAreaProps = {};

export const HeaderArea = (props: HeaderAreaProps) => {
    const { t, i18n } = useTranslation();
    const { guiSetting, generateGetPathFunc } = useAppRoot();
    const { setDialogName } = useGuiState();
    const { displayColorMode, setDisplayColorMode } = useAppState();

    const openLink = (url: string) => {
        if (isDesktopApp()) {
            // @ts-ignore
            window.electronAPI.openBrowser(url);
        } else {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const helpDropdownItems: DropdownItem[] = useMemo(() => {
        return [
            {
                label: t("header_github"),
                onClick: () => openLink("https://github.com/w-okada/ttsclient"),
                icon: generateGetPathFunc("/assets/icons/github.svg"),
            },
            {
                label: t("header_manual"),
                onClick: () => openLink("https://github.com/w-okada/voice-changer/blob/master/tutorials/tutorial_rvc_ja_latest.md"),
                icon: generateGetPathFunc("/assets/icons/help-circle.svg"),
            },
            {
                label: t("header_screen_recorder"),
                onClick: () => openLink("https://w-okada.github.io/screen-recorder-ts/"),
                icon: generateGetPathFunc("/assets/icons/monitor.svg"),
            },
            {
                label: t("header_support"),
                onClick: () => openLink("https://www.buymeacoffee.com/wokad"),
                icon: generateGetPathFunc("/assets/icons/buymeacoffee.png"),
            },
        ];
    }, [i18n.language]);

    const displayColorModeButton = useMemo(() => {
        return (
            <button
                className={`${BasicButton()} ${headerButtonThema}`}
                onClick={() => {
                    setDisplayColorMode(displayColorMode == "light" ? "dark" : "light");
                }}
            >
                {displayColorMode == "light" ? t("header_to_dark_label") : t("header_to_light_label")}
            </button>
        );
    }, [displayColorMode]);

    const settingsButton = useMemo(() => {
        return (
            <button
                className={`${BasicButton()} ${headerButtonThema}`}
                onClick={() => setDialogName("unifiedSettingsDialog")}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
                <FaCog />
                {t("header_settings")}
            </button>
        );
    }, [i18n.language]);

    const header = useMemo(() => {
        return (
            <div className={headerArea}>
                <div className={titleArea}>
                    <span className={title}>Text To Speech Client</span>
                    <span></span>
                    <span className={titleVersion}>{guiSetting.version}</span>
                    <span className={titleVersion}>{guiSetting.edition}</span>
                </div>
                <div className={iconArea}>
                    <span className={iconGroup}>
                        <Dropdown
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <FaQuestionCircle />
                                    {t("header_help")}
                                </div>
                            }
                            items={helpDropdownItems}
                            buttonClassName={`${BasicButton()} ${headerButtonThema}`}
                        />
                    </span>
                    <span className={iconGroup}>
                        {settingsButton}
                        {displayColorModeButton}
                    </span>
                </div>
            </div>
        );
    }, [guiSetting.version, guiSetting.edition, i18n.language, displayColorModeButton, settingsButton, helpDropdownItems]);

    return header;
};
