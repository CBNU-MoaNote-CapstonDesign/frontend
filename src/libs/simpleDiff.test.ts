import getDiff from "./simpledDiff";
import {describe, test, expect} from "@jest/globals";

describe('simpleDiff test', () => {
    test('simpleDiff test...', () => {
        let a = 'abcd';
        let b = 'abcdefg';

        let ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('efg');
        expect(ret.removeLength).toEqual(0);

        a = 'abcd';
        b = 'abcabcd';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('abc');
        expect(ret.removeLength).toEqual(0);

        a = 'abcd';
        b = 'abcdabd';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('abd');
        expect(ret.removeLength).toEqual(0);

        a = 'abcd';
        b = 'newabcd';
        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('new');
        expect(ret.removeLength).toEqual(0);

        a = 'abcd';
        b = 'aefd';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('ef');
        expect(ret.removeLength).toEqual(2);
        expect(ret.removeFrom).toEqual(1);

        a = 'aaaa';
        b = 'aaaaaaa';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('aaa');
        expect(ret.removeLength).toEqual(0);

        a = 'aaaaaaa';
        b = 'aaaa';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual(undefined);
        expect(ret.removeLength).toEqual(3);

        a = 'substring';
        b = 'subring';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual(undefined);
        expect(ret.removeLength).toEqual(2);
        expect(ret.removeFrom).toEqual(3);

        a = 'subring';
        b = 'substring';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('st');
        expect(ret.removeLength).toEqual(0);

        a = 'nothandsome';
        b = 'notawesome';

        ret = getDiff(a, b);
        expect(ret.insertedContent).toEqual('awe');
        expect(ret.removeLength).toEqual(4);
        expect(ret.removeFrom).toEqual(3);
    })
})