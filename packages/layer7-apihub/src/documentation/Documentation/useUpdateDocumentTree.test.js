// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { moveDocument } from './useUpdateDocumentTree';

describe('useUpdateDocumentTree', () => {
    const tree = [
        { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
        { uuid: 'child01', parentUuid: 'root0', ordinal: 0 },
        { uuid: 'child02', parentUuid: 'root0', ordinal: 1 },
        { uuid: 'child03', parentUuid: 'root0', ordinal: 2 },
        { uuid: 'child04', parentUuid: 'root0', ordinal: 3 },
        { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
        { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
        { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
        { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
        { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
    ];

    describe('moveDocument', () => {
        test('should correctly move a node further in its parent tree', () => {
            expect(
                moveDocument({
                    documentUuid: 'child01',
                    newParentUuid: 'root0',
                    ordinal: 2,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child04', parentUuid: 'root0', ordinal: 3 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
        test('should correctly move a node nearer in its parent tree', () => {
            expect(
                moveDocument({
                    documentUuid: 'child04',
                    newParentUuid: 'root0',
                    ordinal: 1,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 3 },
                { uuid: 'child04', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
        test('should correctly move a node at the last position of same parent', () => {
            expect(
                moveDocument({
                    documentUuid: 'child01',
                    newParentUuid: 'root0',
                    ordinal: 3,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 3 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child04', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
        test('should correctly move a node at the first position of same parent', () => {
            expect(
                moveDocument({
                    documentUuid: 'child04',
                    newParentUuid: 'root0',
                    ordinal: 0,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 3 },
                { uuid: 'child04', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
        test('should correctly move a node in another parent', () => {
            expect(
                moveDocument({
                    documentUuid: 'child01',
                    newParentUuid: 'root1',
                    ordinal: 2,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child04', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 3 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 4 },
            ]);
        });
        test('should correctly move a node at the last position of another parent', () => {
            expect(
                moveDocument({
                    documentUuid: 'child04',
                    newParentUuid: 'root1',
                    ordinal: 4,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child04', parentUuid: 'root1', ordinal: 4 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
        test('should correctly move a node at the first position of another parent', () => {
            expect(
                moveDocument({
                    documentUuid: 'child04',
                    newParentUuid: 'root1',
                    ordinal: 0,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child04', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 3 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 4 },
            ]);
        });
        test('should correctly move a node at the last position of root elements', () => {
            expect(
                moveDocument({
                    documentUuid: 'child04',
                    newParentUuid: undefined,
                    ordinal: 2,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 0 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child04', parentUuid: undefined, ordinal: 2 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
        test('should correctly move a node at the first position of root elements', () => {
            expect(
                moveDocument({
                    documentUuid: 'child04',
                    newParentUuid: undefined,
                    ordinal: 0,
                    allDocuments: tree,
                })
            ).toEqual([
                { uuid: 'root0', parentUuid: undefined, ordinal: 1 },
                { uuid: 'child01', parentUuid: 'root0', ordinal: 0 },
                { uuid: 'child02', parentUuid: 'root0', ordinal: 1 },
                { uuid: 'child03', parentUuid: 'root0', ordinal: 2 },
                { uuid: 'child04', parentUuid: undefined, ordinal: 0 },
                { uuid: 'root1', parentUuid: undefined, ordinal: 2 },
                { uuid: 'child11', parentUuid: 'root1', ordinal: 0 },
                { uuid: 'child12', parentUuid: 'root1', ordinal: 1 },
                { uuid: 'child13', parentUuid: 'root1', ordinal: 2 },
                { uuid: 'child14', parentUuid: 'root1', ordinal: 3 },
            ]);
        });
    });
});
