/**
 * Test for Promise caching
 *
 */

import {getPromise} from '../promiseCache';


test('getPromise() should return null if function is not passed', () => {
    expect(getPromise('foo')).toBeNull();
});

test('getPromise() should return null if name is not passed', () => {
    expect(getPromise('', function () {
        })).toBeNull();
});

test('getPromise() should return existing promise', () => {
    var promise1 = getPromise('foo', function (p) {
        });
    var promise2 = getPromise('foo', function (p) {
        });
    expect(promise1).toEqual(promise2);
});

test('getPromise() should return new promise if it doesnt exist', () => {
    expect(getPromise('foo', function (p) {
        })).toBeDefined();
});

test('getPromise() should return new promise if shouldFetch is true', () => {
    expect(getPromise('foo', function (p) {
    })).toBeDefined();
});