import React, { useEffect, useMemo, useState } from "react";
import { useGuiState } from "../../GuiStateProvider";
import { ModelSlotManagerMainDialog } from "./Dialogs_ModelSlotManagerMainDialog";
import { dialogContainer, dialogContainerShow } from "../../../styles/dialog.css";
import { ModelSlotManagerFileUploadDialog } from "./Dialogs_ModelSlotManagerFileUploadDialog";
import { StartingNoticeDialog } from "./Dialogs_StartingNoticeDialog";
import { VoiceCharacterSlotManagerMainDialog } from "./Dialogs_VoiceCharacterSlotManagerMainDialog";
import { VoiceCharacterSlotManagerFileUploadDialog } from "./Dialogs_VoiceCharacterSlotManagerFileUploadDialog";
import { AboutVoiceDialog } from "./Dialogs_AboutVoiceDialog";
import { AboutModelDialog } from "./Dialogs_AboutModelDialog";
import { AdvancedSettingDialog } from "./Dialogs_AdvancedSettingDialog";
import { UnifiedSettingsDialog } from "./Dialogs_UnifiedSettingsDialog";
import { EmotionColorDialog } from "./Dialogs_EmotionColorDialog";
import { ModelSlotManagerSamplesDialog } from "./Dialogs_ModelSlotManagerSamplesDialog";
import { VoiceCharacterSlotManagerSamplesDialog } from "./Dialogs_VoiceCharacterSlotManagerSamplesDialog";

export const Dialogs = () => {
    const guiState = useGuiState();
    const [targetSlotIndex, setTargetSlotIndex] = useState<number>(0);
    const openFileUploadDialog = (targetSlotIndex: number) => {
        setTargetSlotIndex(targetSlotIndex);
        guiState.setDialogName("modelSlotManagerFileUploaderDialog");
    };
    const openSampleDialog = (targetSlotIndex: number) => {
        setTargetSlotIndex(targetSlotIndex);
        guiState.setDialogName("modelSlotManagerSamplesDialog");
    };
    const openVoiceCharacterFileUploadDialog = (targetSlotIndex: number) => {
        setTargetSlotIndex(targetSlotIndex);
        guiState.setDialogName("voiceCharacterManagerFileUploaderDialog");
    }
    const openVoiceCharacterSampleDialog = (targetSlotIndex: number) => {
        setTargetSlotIndex(targetSlotIndex);
        guiState.setDialogName("voiceCharacterManagerSamplesDialog");
    };

    const currentDialog = useMemo(() => {
        if (guiState.dialogName === "none") {
            return <></>;
        } else if (guiState.dialogName === "startingNoticeDialog") {
            return <StartingNoticeDialog></StartingNoticeDialog>;
        } else if (guiState.dialogName === "modelSlotManagerMainDialog") {
            return <ModelSlotManagerMainDialog openFileUploadDialog={openFileUploadDialog} openSampleDialog={openSampleDialog}></ModelSlotManagerMainDialog>;
        } else if (guiState.dialogName === "modelSlotManagerFileUploaderDialog") {
            return <ModelSlotManagerFileUploadDialog slotIndex={targetSlotIndex}></ModelSlotManagerFileUploadDialog>;
        } else if (guiState.dialogName === "modelSlotManagerSamplesDialog") {
            return <ModelSlotManagerSamplesDialog slotIndex={targetSlotIndex}></ModelSlotManagerSamplesDialog>;
        } else if (guiState.dialogName === "voiceCharacterManagerMainDialog") {
            return <VoiceCharacterSlotManagerMainDialog
                openFileUploadDialog={openVoiceCharacterFileUploadDialog}
                openVoiceCharacterSampleDialog={openVoiceCharacterSampleDialog}
            ></VoiceCharacterSlotManagerMainDialog>;
        } else if (guiState.dialogName === "voiceCharacterManagerSamplesDialog") {
            return <VoiceCharacterSlotManagerSamplesDialog slotIndex={targetSlotIndex}></VoiceCharacterSlotManagerSamplesDialog>
        } else if (guiState.dialogName === "voiceCharacterManagerFileUploaderDialog") {
            return <VoiceCharacterSlotManagerFileUploadDialog slotIndex={targetSlotIndex}></VoiceCharacterSlotManagerFileUploadDialog>;
        } else if (guiState.dialogName === "advancedSettingDialog") {
            return <AdvancedSettingDialog></AdvancedSettingDialog>;
        } else if (guiState.dialogName === "unifiedSettingsDialog") {
            return <UnifiedSettingsDialog></UnifiedSettingsDialog>;
        } else if (guiState.dialogName === "aboutModelDialog") {
            return <AboutModelDialog></AboutModelDialog>;
        } else if (guiState.dialogName === "aboutVoiceDialog") {
            return <AboutVoiceDialog></AboutVoiceDialog>;
        } else if (guiState.dialogName === "emotionColorDialog") {
            return <EmotionColorDialog ></EmotionColorDialog>;
        } else {
            return <></>;
        }
    }, [guiState.dialogName]);

    const dialog = (
        <div id="dialog-container" className={dialogContainer}>
            {currentDialog}
        </div>
    );

    useEffect(() => {
        const container = document.getElementById("dialog-container");
        if (!container) {
            return;
        }
        if (guiState.dialogName === "none") {
            container.classList.remove(`${dialogContainerShow}`);
        } else {
            container.classList.add(`${dialogContainerShow}`);
        }
    }, [guiState.dialogName]);

    return dialog;
};
