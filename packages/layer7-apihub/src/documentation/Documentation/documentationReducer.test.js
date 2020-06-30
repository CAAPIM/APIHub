import {
    documentationTreeReducer,
    SAVE_EXPANDED_NODES,
} from './documentationReducer';

describe('documentationReducer', () => {
    describe('documentationTreeReducer', () => {
        test('should return the previous state if the type is not "SAVE_EXPANDED_NODES"', () => {
            const previousState = {
                hello: 'bonjour',
            };

            const params = {
                type: 'TEST',
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
            });
        });

        test('should return the previous state if the type is "SAVE_EXPANDED_NODES" and the payload entityUuid is not defined', () => {
            const previousState = {
                hello: 'bonjour',
            };

            const params = {
                type: SAVE_EXPANDED_NODES,
                payload: {
                    entityUuid: undefined,
                    locale: 'fr',
                },
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
            });
        });

        test('should return the previous state if the type is "SAVE_EXPANDED_NODES" and the payload locale is not defined', () => {
            const previousState = {
                hello: 'bonjour',
            };

            const params = {
                type: SAVE_EXPANDED_NODES,
                payload: {
                    entityUuid: 'covfefe',
                    locale: undefined,
                },
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
            });
        });

        test('should change the state by adding expanded nodes if the type is "SAVE_EXPANDED_NODES"', () => {
            const previousState = {
                hello: 'bonjour',
            };

            const params = {
                type: SAVE_EXPANDED_NODES,
                payload: {
                    entityUuid: 'covfefe',
                    locale: 'fr',
                    expandedNodes: 'noeud1',
                },
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud1',
                },
            });
        });

        test('should change the state by adding expanded nodes for several entity uuid if the type is "SAVE_EXPANDED_NODES"', () => {
            const previousState = {
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud1',
                },
            };

            const params = {
                type: SAVE_EXPANDED_NODES,
                payload: {
                    entityUuid: 'covfafa',
                    locale: 'fr',
                    expandedNodes: 'noeud2',
                },
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud1',
                },
                covfafa: {
                    fr: 'noeud2',
                },
            });
        });

        test('should change the state by adding expanded nodes for several languages with the same entity uuid if the type is "SAVE_EXPANDED_NODES"', () => {
            const previousState = {
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud1',
                },
            };

            const params = {
                type: SAVE_EXPANDED_NODES,
                payload: {
                    entityUuid: 'covfefe',
                    locale: 'en',
                    expandedNodes: 'noeud2',
                },
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud1',
                    en: 'noeud2',
                },
            });
        });

        test('should change the state by replacing the existing expandedNodes by the new ones if the type is "SAVE_EXPANDED_NODES"', () => {
            const previousState = {
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud1',
                },
            };

            const params = {
                type: SAVE_EXPANDED_NODES,
                payload: {
                    entityUuid: 'covfefe',
                    locale: 'fr',
                    expandedNodes: 'noeud2',
                },
            };

            expect(documentationTreeReducer(previousState, params)).toEqual({
                hello: 'bonjour',
                covfefe: {
                    fr: 'noeud2',
                },
            });
        });
    });
});
