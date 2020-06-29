import {
    getFirstDocument,
    getDocumentationTree,
    getSiblingsDocuments,
    getMaxOrdinalFromDocuments,
    hasParentWithId,
} from './tree';

describe('tree', () => {
    describe('getDocumentationTree', () => {
        test('should return a tree of documents from an array', () => {
            expect(
                getDocumentationTree([
                    { uuid: 'root1' },
                    { uuid: 'root2' },
                    { uuid: 'child1_1', parentUuid: 'root1' },
                    { uuid: 'child1_2', parentUuid: 'root1' },
                    { uuid: 'child2_1', parentUuid: 'root2' },
                    { uuid: 'child1_1_1', parentUuid: 'child1_1' },
                    { uuid: 'child1_1_2', parentUuid: 'child1_1' },
                    {
                        id: 'new-document',
                        uuid: undefined,
                        parentUuid: 'root1',
                    },
                ])
            ).toEqual([
                {
                    uuid: 'root1',
                    children: [
                        {
                            uuid: 'child1_1',
                            parentUuid: 'root1',
                            children: [
                                {
                                    uuid: 'child1_1_1',
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                                {
                                    uuid: 'child1_1_2',
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                            ],
                        },
                        { uuid: 'child1_2', parentUuid: 'root1', children: [] },
                        {
                            id: 'new-document',
                            parentUuid: 'root1',
                            children: [],
                        },
                    ],
                },
                {
                    uuid: 'root2',
                    children: [
                        { uuid: 'child2_1', parentUuid: 'root2', children: [] },
                    ],
                },
            ]);
        });

        test('should sort the siblings documents', () => {
            expect(
                getDocumentationTree(
                    [
                        { uuid: 'child1_1', parentUuid: 'root1', ordinal: 0 },
                        { uuid: 'root2', ordinal: 1 },
                        { uuid: 'child1_2', parentUuid: 'root1', ordinal: 1 },
                        {
                            uuid: 'child1_1_1',
                            parentUuid: 'child1_1',
                            ordinal: 0,
                        },
                        { uuid: 'root1', ordinal: 0 },
                        { uuid: 'child2_1', parentUuid: 'root2', ordinal: 0 },
                        {
                            uuid: 'child1_1_2',
                            parentUuid: 'child1_1',
                            ordinal: 1,
                        },
                    ],
                    (a, b) => a.ordinal - b.ordinal // Sort by ordinal
                )
            ).toEqual([
                {
                    uuid: 'root1',
                    ordinal: 0,
                    children: [
                        {
                            uuid: 'child1_1',
                            ordinal: 0,
                            parentUuid: 'root1',
                            children: [
                                {
                                    uuid: 'child1_1_1',
                                    ordinal: 0,
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                                {
                                    uuid: 'child1_1_2',
                                    ordinal: 1,
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                            ],
                        },
                        {
                            uuid: 'child1_2',
                            ordinal: 1,
                            parentUuid: 'root1',
                            children: [],
                        },
                    ],
                },
                {
                    uuid: 'root2',
                    ordinal: 1,
                    children: [
                        {
                            uuid: 'child2_1',
                            ordinal: 0,
                            parentUuid: 'root2',
                            children: [],
                        },
                    ],
                },
            ]);
        });
    });

    describe('getSiblingsDocuments', () => {
        test('should find first level documents', () => {
            const tree = [
                {
                    uuid: 'root1',
                    children: [
                        {
                            uuid: 'child1_1',
                            parentUuid: 'root1',
                            children: [
                                {
                                    uuid: 'child1_1_1',
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                                {
                                    uuid: 'child1_1_2',
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                            ],
                        },
                        { uuid: 'child1_2', parentUuid: 'root1', children: [] },
                    ],
                },
                {
                    uuid: 'root2',
                    children: [
                        { uuid: 'child2_1', parentUuid: 'root2', children: [] },
                    ],
                },
            ];

            const result = getSiblingsDocuments(tree, undefined);

            expect(result).toHaveLength(2);
            expect(result.map(item => item.uuid)).toEqual(['root1', 'root2']);
        });

        test('should find deep siblings documents', () => {
            const tree = [
                {
                    uuid: 'root1',
                    children: [
                        {
                            uuid: 'child1_1', // Selected parentUuid
                            parentUuid: 'root1',
                            children: [
                                {
                                    uuid: 'child1_1_1',
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                                {
                                    uuid: 'child1_1_2',
                                    parentUuid: 'child1_1',
                                    children: [],
                                },
                            ],
                        },
                        { uuid: 'child1_2', parentUuid: 'root1', children: [] },
                    ],
                },
                {
                    uuid: 'root2',
                    children: [
                        { uuid: 'child2_1', parentUuid: 'root2', children: [] },
                    ],
                },
            ];

            const result = getSiblingsDocuments(tree, 'child1_1');

            expect(result).toHaveLength(2);
            expect(result.map(item => item.uuid)).toEqual([
                'child1_1_1',
                'child1_1_2',
            ]);
        });

        test('should work when children are not defined or empty', () => {
            const tree = [
                {
                    uuid: 'root1',
                    children: [
                        {
                            uuid: 'child1_1',
                            parentUuid: 'root1',
                            children: [
                                {
                                    uuid: 'child1_1_1', // Selected parentUuid
                                    parentUuid: 'child1_1',
                                },
                                {
                                    uuid: 'child1_1_2',
                                    parentUuid: 'child1_1',
                                },
                            ],
                        },
                        { uuid: 'child1_2', parentUuid: 'root1' },
                    ],
                },
                {
                    uuid: 'root2',
                    children: [{ uuid: 'child2_1', parentUuid: 'root2' }],
                },
            ];

            const result = getSiblingsDocuments(tree, 'child1_1_1');

            expect(result).toHaveLength(0);
        });
    });

    describe('getFirstDocument', () => {
        test('should return null if the documents are not an array', () => {
            expect(getFirstDocument()).toEqual(null);
        });

        test('should return null if there is no documents', () => {
            expect(getFirstDocument([])).toEqual(null);
        });

        test('should return the document with the lowest ordinal', () => {
            const result = getFirstDocument([
                { uuid: 'slt2', ordinal: 2 },
                { uuid: 'slt1', ordinal: 1 },
                { uuid: 'slt4', ordinal: 4 },
                { uuid: 'slt3', ordinal: 3 },
            ]);
            expect(result.uuid).toEqual('slt1');
        });

        test('should return the root document with the lowest ordinal', () => {
            const result = getFirstDocument([
                { uuid: 'slt2', ordinal: 2 },
                { uuid: 'slt1', ordinal: 1 },
                { uuid: 'slt4', ordinal: 4 },
                { uuid: 'slt3', ordinal: 3 },
                { uuid: 'slt10', ordinal: 0, parentUuid: 'slt1' }, // The lowest ordinal, but not a root document
                { uuid: 'slt11', ordinal: 1, parentUuid: 'slt1' },
            ]);
            expect(result.uuid).toEqual('slt1');
        });
    });

    describe('getMaxOrdinalFromDocuments', () => {
        test('should return -1 if the documents are not an array', () => {
            expect(getMaxOrdinalFromDocuments()).toEqual(-1);
        });

        test('should return -1 if there is no documents', () => {
            expect(getMaxOrdinalFromDocuments([])).toEqual(-1);
        });

        test('should return the max ordinal', () => {
            expect(
                getMaxOrdinalFromDocuments([
                    { ordinal: 2 },
                    { ordinal: 1 },
                    { ordinal: 4 },
                    { ordinal: 3 },
                ])
            ).toEqual(4);
        });

        test('should return the max ordinal even with negative numbers', () => {
            expect(
                getMaxOrdinalFromDocuments([
                    { ordinal: -4 },
                    { ordinal: 1 },
                    { ordinal: -1 },
                    { ordinal: 4 },
                ])
            ).toEqual(4);
        });
    });

    describe('hasParentWithId', () => {
        test('should returns true if the first parent is equal to the node searched for', () => {
            expect(
                hasParentWithId(
                    [{ uuid: 'parent' }, { uuid: 'parent1' }],
                    'parent',
                    'parent'
                )
            ).toEqual(true);
        });
        test('should returns false if the parent does not exist', () => {
            expect(
                hasParentWithId(
                    [{ uuid: 'parent' }, { uuid: 'parent1' }],
                    'not_found',
                    'node'
                )
            ).toEqual(false);
        });
        test('should returns false if the first parent is not equal to the node searched for', () => {
            expect(
                hasParentWithId(
                    [{ uuid: 'parent' }, { uuid: 'parent1' }],
                    'parent',
                    'parent1'
                )
            ).toEqual(false);
        });
        test('should returns true if the node searched for is a distant parent of the first parent', () => {
            expect(
                hasParentWithId(
                    [
                        { uuid: 'parent2', parentUuid: 'parent1' },
                        { uuid: 'parent1', parentUuid: 'parent0' },
                        { uuid: 'parent0' },
                    ],
                    'parent2',
                    'parent0'
                )
            ).toEqual(true);
        });
        test('should returns false if the node searched for is not a distant parent of the first parent', () => {
            expect(
                hasParentWithId(
                    [
                        { uuid: 'parent2', parentUuid: 'parent1' },
                        { uuid: 'parent1', parentUuid: 'parent0' },
                        { uuid: 'parent0' },
                    ],
                    'parent2',
                    'another'
                )
            ).toEqual(false);
        });
    });
});
