import { ReactionsType, UserType } from "@/types/global";

// Language types
export interface RegisterLanguageType {
    language: string,
    iso_code: string,
    glottolog_code: string,
    language_type: string,
}


export interface LanguageType extends RegisterLanguageType {
    id: string,
    created_at: string,
    edited_at: string,
}

// Word types
export interface CreateWordType {
    translation: string,
    word: string,
    source_language: string,
    target_language: string,
    synonym?: string[],
    antonym?: string[],
}


export interface WordType extends CreateWordType {
    id: number,
    user: UserType
}


// Sentence types
export interface CreateSentenceType {
    translation: string,
    sentence: string,
    source_language: string,
    target_language: string,
}

export interface SentenceType extends CreateSentenceType {
    id: number,
    user: UserType
}


// Saying types
export interface CreateSayingType {
    saying: string,
    language: string,
}

export interface SayingType extends CreateSayingType {
    id: number,
    saying: string,
    language: string,
    user: UserType,
    reactions: ReactionsType,
    created_at: string,
    edited_at: string,
}


// Poem types
export interface CreatePoemType {
    poem: string,
    recording?: File | undefined,
    language: string,
}

export interface PoemType extends CreatePoemType {
    id: number,
    user: UserType,
    reactions: ReactionsType,
    created_at: string,
    edited_at: string,
}


export interface SimplePoemType {
    id: number,
    poem: string,
    slug: string,
}