export interface TranslateKey {
    translate: string;
    with?: TranslateKey[];
}

interface StringCriteria {
    [variant: string]: Variant;
}

interface ActiveCriteria {
    active?: { trigger: string };
}

export type Criteria = StringCriteria | ActiveCriteria;

export interface Display {
    icon: Icon;
    title: TranslateKey;
    description: TranslateKey;
    background?: string;
    frame: string;
    show_toast: boolean;
    announce_to_chat: boolean;
    hidden: boolean;
}

export interface Icon {
    id: string;
    components?: { 'minecraft:custom_model_data': JSON };
}

export interface Variant {
    trigger: string;
    conditions: { items: ItemsEntity[] };
}

export interface ItemsEntity {
    items: string[];
    nbt: string;
}
