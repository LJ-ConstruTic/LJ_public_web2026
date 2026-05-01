export const TAGS_DICTIONARY = {
    PRO_HEALT: 'proHealt',
    PRO_UMB_CULTURE: 'proUmbCultute',
    WE_VISION: 'weVision', // nossa visão
    SERV_COLABOR: 'servColabor',
    WE_ARE_NAME_2: 'WeAreName2', // Jose
    WE_ARE_NAME_3: 'WeAreName3', // Pedro Muteca
    COMPANY_LOGO_PRINCIPAL: 'companyLogoprincipal',
    HEAD_WE_ARE: 'headWeAre', // about
} as const;

export type TagKey = typeof TAGS_DICTIONARY[keyof typeof TAGS_DICTIONARY];