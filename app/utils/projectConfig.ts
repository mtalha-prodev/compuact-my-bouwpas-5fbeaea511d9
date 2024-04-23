export type TProjectConfig = {
    "onsiteVeiligheidsinstructie": string;
    "onsiteHandtekening": string;
    "onsiteKeesing": string;
    "keesingusername": string|null;
    "onsiteToegangspassen": string;
    "onsiteToegangspassenCreator":string;
    "onsiteToegangspassenChip": string;
    "onsiteToegangspassenClient": string;
    "onsiteToegangspassenReports": string;
    "onsiteToegangspassenWorkerTemplateId": number;
    "onsiteToegangspassenAdminTemplateId": number;
    "onsiteToegangspassenVisitorTemplateId": number;
    "onsiteToegangspassenAnonvisitorTemplateId": number;
    "onsiteSecurityAanbiederid": number;
    "onsiteVeiligheidstekst": string;
    "assessmentOaIds": string;
    "workflowSetting": string|null;
    "penvoerderworkersexempt": number;
    "vcaRequired": boolean;
    "onderhoudsproject": boolean;
    "vcaVolZzpRequired": boolean;
    "workerPiInfo": string;
    "antiPassback": boolean;
    "antiPassbackDefault": boolean;
    "gpiRequired": boolean;
    "vcaVisitorRequired": boolean;
    "vcaDerdeRequired": boolean;
    "allowKeesingSkip": boolean;
    "onsiteSecurityAanbiederConfig": string;
    "oaWorkersExempt": string;
    
  }