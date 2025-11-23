import React, { useMemo } from "react";
import {
    closeButton,
    closeButtonRow,
    dialogFixedSizeContent,
    dialogFrame,
    dialogItemName20,
    dialogItemRow,
    dialogItemValue,
    dialogTitle,
    execButton,
    instructions,
} from "../../../styles/dialog.css";
import { useGuiState } from "../../GuiStateProvider";
import { useTranslation } from "react-i18next";
import { useAppRoot } from "../../../001_AppRootProvider";
import { useAppState } from "../../../002_AppStateProvider";
import { Logger } from "../../../util/logger";
import { isDesktopApp } from "../../../util/isDesctopApp";
import { BrowserAudioDeviceAreaDeviceSelect } from "../005-1_BrowserAudioDeviceAreaDeviceSelect";
import { InferenceAreaBackend } from "../005-2_InferenceAreaBackend";

type CloseButtonRowProps = {
    closeClicked: () => void;
};

const CloseButtonRow = (props: CloseButtonRowProps) => {
    const { t } = useTranslation();
    return (
        <div className={closeButtonRow}>
            <div
                className={closeButton}
                onClick={() => {
                    props.closeClicked();
                }}
            >
                {t("dialog_advanced_setting_button_close")}
            </div>
        </div>
    );
};

const LanguageSelector = () => {
    const { t, i18n } = useTranslation();
    const { guiSetting } = useAppRoot();

    const component = useMemo(() => {
        if (!guiSetting.setting) {
            return <></>;
        }
        const languages = guiSetting.setting.lang;
        return (
            <div className={dialogItemRow}>
                <div className={dialogItemName20}>{t("header_language")}</div>
                <div className={dialogItemValue}>
                    <select
                        defaultValue={i18n.language}
                        onChange={(event) => {
                            Logger.getLogger().info("change lang", event.target.value, i18n.language);
                            i18n.changeLanguage(event.target.value);
                            location.reload();
                        }}
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }, [i18n.language, guiSetting.setting?.lang]);

    return component;
};

const InitializeServerButton = () => {
    const { t } = useTranslation();
    const { serverConfigState } = useAppRoot();
    const { setDialog2Props, setDialog2Name } = useGuiState();

    const component = useMemo(() => {
        const onClearSettingClicked = async () => {
            let ok = false;
            const p = new Promise<boolean>((resolve) => {
                setDialog2Props({
                    title: t("header_initialize_confirm_dialog_title"),
                    instruction: `${t("header_initialize_confirm_dialog_instruction")}`,
                    defaultValue: "",
                    resolve: resolve,
                    options: null,
                });
                setDialog2Name("confirmDialog");
            });
            const res = await p;
            if (res == true) {
                ok = true;
            } else {
                ok = false;
            }

            if (ok) {
                await serverConfigState.initializeServer();
            }
        };

        return (
            <div className={dialogItemRow}>
                <div className={dialogItemName20}>{t("header_initialize")}</div>
                <div className={dialogItemValue}>
                    <span className={execButton} onClick={onClearSettingClicked}>
                        {t("header_initialize")}
                    </span>
                </div>
            </div>
        );
    }, []);

    return component;
};

const AdvancedSettingsButton = () => {
    const { t } = useTranslation();
    const { setDialogName } = useGuiState();

    const component = useMemo(() => {
        return (
            <div className={dialogItemRow}>
                <div className={dialogItemName20}>{t("config_area_more_actions_area_advanced_setting")}</div>
                <div className={dialogItemValue}>
                    <span className={execButton} onClick={() => setDialogName("advancedSettingDialog")}>
                        {t("config_area_more_actions_area_advanced_setting")}
                    </span>
                </div>
            </div>
        );
    }, []);

    return component;
};

const LogViewerButton = () => {
    const { t } = useTranslation();

    const component = useMemo(() => {
        const onOpenLogViewerClicked = async () => {
            if (isDesktopApp()) {
                const url = new URL(window.location.href);
                const baseUrl = `${url.protocol}//${url.hostname}${url.port ? ":" + url.port : ""}`;
                // @ts-ignore
                window.electronAPI.openBrowser(`${baseUrl}/?app_mode=LogViewer`);
            } else {
                window.open("/?app_mode=LogViewer", "_blank", "noopener,noreferrer");
            }
        };

        return (
            <div className={dialogItemRow}>
                <div className={dialogItemName20}>{t("config_area_more_actions_area_open_log_viewer")}</div>
                <div className={dialogItemValue}>
                    <span className={execButton} onClick={onOpenLogViewerClicked}>
                        {t("config_area_more_actions_area_open_log_viewer")}
                    </span>
                </div>
            </div>
        );
    }, []);

    return component;
};

const DownloadLogButton = () => {
    const { t } = useTranslation();

    const component = useMemo(() => {
        const onDownloadLogClicked = async () => {
            const clientLogs = Logger.getLogger().getLogs();
            const clientogTexts = clientLogs
                .map((log) => {
                    return `${log.timestamp}\t${log.level}\t${log.message.join("\t")}`;
                })
                .reduce((prev, current) => {
                    return `${prev}\n${current}`;
                }, "");

            const serverLogRes = await fetch("/vcclient.log");
            const serverLogTexts = await serverLogRes.text();

            const outputLogs = "===== Server Logs =======\n" + serverLogTexts + "====== Client Logs ======\n" + clientogTexts;

            const blob = new Blob([outputLogs], { type: "application/json" });

            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "logs.txt";
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
        };

        return (
            <div className={dialogItemRow}>
                <div className={dialogItemName20}>{t("config_area_more_actions_area_download_log")}</div>
                <div className={dialogItemValue}>
                    <span className={execButton} onClick={onDownloadLogClicked}>
                        {t("config_area_more_actions_area_download_log")}
                    </span>
                </div>
            </div>
        );
    }, []);

    return component;
};

const DeviceSettings = () => {
    const { t } = useTranslation();
    const { serverConfigState } = useAppRoot();

    const component = useMemo(() => {
        if (!serverConfigState.serverConfiguration) {
            return <></>;
        }
        return (
            <>
                <div className={dialogItemRow}>
                    <div className={dialogItemName20}>{t("configuration_area_title")}</div>
                    <div className={dialogItemValue}></div>
                </div>
                <div style={{ paddingLeft: "20px" }}>
                    <BrowserAudioDeviceAreaDeviceSelect type={"Output"}></BrowserAudioDeviceAreaDeviceSelect>
                    <BrowserAudioDeviceAreaDeviceSelect type={"Monitor"}></BrowserAudioDeviceAreaDeviceSelect>
                    <InferenceAreaBackend></InferenceAreaBackend>
                </div>
            </>
        );
    }, [serverConfigState.serverConfiguration]);

    return component;
};

export const UnifiedSettingsDialog = () => {
    const { t } = useTranslation();
    const { setDialogName } = useGuiState();

    const backClicked = () => {
        setDialogName("none");
    };

    const component = useMemo(() => {
        return (
            <div className={dialogFrame}>
                <div className={dialogTitle}>{t("dialog_unified_settings_title")}</div>
                <div className={instructions}>{t("dialog_unified_settings_instruction")}</div>
                <div className={dialogFixedSizeContent}>
                    <LanguageSelector />
                    <InitializeServerButton />
                    <AdvancedSettingsButton />
                    <LogViewerButton />
                    <DownloadLogButton />
                    <DeviceSettings />
                </div>
                <CloseButtonRow closeClicked={backClicked}></CloseButtonRow>
            </div>
        );
    }, []);

    return component;
};
