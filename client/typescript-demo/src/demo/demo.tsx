import React, { useEffect } from "react";
import { GuiStateProvider } from "./GuiStateProvider";
import { Dialogs } from "./component/dialogs/Dialogs";
import { Dialogs2 } from "./component/dialogs/Dialogs2";
import { HeaderArea } from "./component/001_HeaderArea";
import { ModelSlotArea } from "./component/002-1_ModelSlotArea";
import { CharacterArea } from "./component/003_CharacterArea";
import { configArea, configAreaRow } from "../styles/configArea.css";
import { useAppState } from "../002_AppStateProvider";
import { VoiceCharacterSlotArea } from "./component/002-2_VoiceCharacterSlotArea";
import { darkTheme, lightTheme, spacer_h10px } from "../styles";
import { TextInputArea } from "./component/004_TextInputArea";
import { CollapsibleSection } from "./common/CollapsibleSection";
import { useTranslation } from "react-i18next";

export const Demo = () => {
    const { displayColorMode } = useAppState();
    const { t } = useTranslation();
    useEffect(() => {
        const bodyClass = displayColorMode == "light" ? lightTheme : darkTheme;
        document.body.className = bodyClass;
    }, [displayColorMode]);
    return (
        <GuiStateProvider>
            <Dialogs2 />
            <Dialogs />
            <HeaderArea></HeaderArea>
            <ModelSlotArea></ModelSlotArea>
            <div className={spacer_h10px}></div>
            <VoiceCharacterSlotArea></VoiceCharacterSlotArea>
            <CollapsibleSection
                title={t("character_area_title")}
                defaultExpanded={true}
                storageKey="collapsible_character_area"
                headerClassName=""
                contentClassName=""
            >
                <CharacterArea></CharacterArea>
            </CollapsibleSection>
            <CollapsibleSection
                title={t("text_input_area_title")}
                defaultExpanded={true}
                storageKey="collapsible_text_input_area"
                headerClassName=""
                contentClassName=""
            >
                <TextInputArea></TextInputArea>
            </CollapsibleSection>
        </GuiStateProvider>
    );
};
