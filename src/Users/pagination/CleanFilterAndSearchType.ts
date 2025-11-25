import { SortQueryFilterNumberType } from './sortQueryFilter.ntype';

/**
 * Объединенный тип для передачи в репозиторий findAllUsers.
 * * Содержит:
 * 1. ЧИСТЫЕ, преобразованные поля для сортировки/пагинации (из SortQueryFilterNumberType).
 * 2. Поля для поиска, которые остаются опциональными (searchLoginTerm, searchEmailTerm).
 */
export type CleanFilterAndSearchType = SortQueryFilterNumberType & {
    /**
     * Термин для поиска по логину.
     * Остается опциональным, т.к. может не прийти в запросе.
     */
    searchLoginTerm?: string;

    /**
     * Термин для поиска по email.
     * Остается опциональным, т.к. может не прийти в запросе.
     */
    searchEmailTerm?: string;
};