export const TAGS_DICTIONARY = {
    // slider:
    SLI_PROJECTBUILD_TITLE: 'sliProjectbuildTitle',
    SLI_PROJECTBUILD_CTX: 'sliProjectbuildContext',
    SLI_APP_TITLE: 'sliAppTitle',
    SLI_APP_CTX: 'sliAppContext',
    SLI_REFORM_TITLE: 'sliReformTitle',
    SLI_REFORM_CTX: 'sliReformContext',
    SLI_MANTEN_TITLE: 'sliMantenSoftTitle',
    SLI_MANTEN_CTX: 'sliMantenSoftContext',
    SLI_REFORM2_TITLE: 'sliReform2Title',
    SLI_REFORM2_CTX: 'sliReform2Context',

    // About
    HOM_TITLE: 'homTitle',
    HOM_PRESENTATION: 'homPresentation',
    HOM_TITLE_2: 'homTitle2',
    WE_HISTORY_CTX: 'weHistoryContext',

    // About-detail:
    WE_HISTORY_CTX_2: 'weHistoryContext2',
    WE_HISTORY_CTX_3: 'weHistoryContext3',
} as const;

export type TagKey = typeof TAGS_DICTIONARY[keyof typeof TAGS_DICTIONARY];