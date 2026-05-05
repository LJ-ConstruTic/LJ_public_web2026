// Rutas estáticas de assets. Las que vienen de la API van por TagStore ($tagByKey().imgUrl)
export const IMG_DICTIONARY = {
    // Slider
    SLIDE_PROJECTBUILD: '' as string,
    SLIDE_APP: '' as string,
    SLIDE_REFORM: '' as string,
    SLIDE_MANTEN: '' as string,
    SLIDE_REFORM2: '' as string,

    // Main:
    COMPANY_LOGO_PRINCIPAL: 'companyLogoprincipal',
    PRO_HEALT: 'proHealt',
    PRO_UMB_CULTURE: 'proUmbCultute',
    SERV_COLABOR: 'servColabor',

    // About:
    HEAD_WE_ARE: 'headWeAre', // about

    // About-detail:
    WE_VISION: 'weVision', // nossa visão
    WE_ARE_NAME_2: 'WeAreName2', // Jose
    WE_ARE_NAME_3: 'WeAreName3', // Pedro Muteca
} as const;

export type ImgKey = Exclude <typeof IMG_DICTIONARY[keyof typeof IMG_DICTIONARY], '' // excluye los strings vacíos del slider
>;