/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {fakeAsync} from '@angular/core/testing/src/fake_async';

import {SyncAsync, escapeRegExp, splitAtColon, stringify, utf8Encode} from '../src/util';

{
  describe('util', () => {
    describe('splitAtColon', () => {
      it('should split when a single ":" is present', () => {
        expect(splitAtColon('a:b', [])).toEqual(['a', 'b']);
      });

      it('should trim parts', () => { expect(splitAtColon(' a : b ', [])).toEqual(['a', 'b']); });

      it('should support multiple ":"', () => {
        expect(splitAtColon('a:b:c', [])).toEqual(['a', 'b:c']);
      });

      it('should use the default value when no ":" is present', () => {
        expect(splitAtColon('ab', ['c', 'd'])).toEqual(['c', 'd']);
      });
    });

    describe('RegExp', () => {
      it('should escape regexp', () => {
        expect(new RegExp(escapeRegExp('b')).exec('abc')).toBeTruthy();
        expect(new RegExp(escapeRegExp('b')).exec('adc')).toBeFalsy();
        expect(new RegExp(escapeRegExp('a.b')).exec('a.b')).toBeTruthy();
        expect(new RegExp(escapeRegExp('a.b')).exec('axb')).toBeFalsy();
      });
    });

    describe('utf8encode', () => {
      // tests from https://github.com/mathiasbynens/wtf-8
      it('should encode to utf8', () => {
        const tests = [
          ['abc', 'abc'],
          // // 1-byte
          ['\0', '\0'],
          // // 2-byte
          ['\u0080', '\xc2\x80'],
          ['\u05ca', '\xd7\x8a'],
          ['\u07ff', '\xdf\xbf'],
          // // 3-byte
          ['\u0800', '\xe0\xa0\x80'],
          ['\u2c3c', '\xe2\xb0\xbc'],
          ['\uffff', '\xef\xbf\xbf'],
          // //4-byte
          ['\uD800\uDC00', '\xF0\x90\x80\x80'],
          ['\uD834\uDF06', '\xF0\x9D\x8C\x86'],
          ['\uDBFF\uDFFF', '\xF4\x8F\xBF\xBF'],
          // unmatched surrogate halves
          // high surrogates: 0xD800 to 0xDBFF
          ['\uD800', '\xED\xA0\x80'],
          ['\uD800\uD800', '\xED\xA0\x80\xED\xA0\x80'],
          ['\uD800A', '\xED\xA0\x80A'],
          ['\uD800\uD834\uDF06\uD800', '\xED\xA0\x80\xF0\x9D\x8C\x86\xED\xA0\x80'],
          ['\uD9AF', '\xED\xA6\xAF'],
          ['\uDBFF', '\xED\xAF\xBF'],
          // low surrogates: 0xDC00 to 0xDFFF
          ['\uDC00', '\xED\xB0\x80'],
          ['\uDC00\uDC00', '\xED\xB0\x80\xED\xB0\x80'],
          ['\uDC00A', '\xED\xB0\x80A'],
          ['\uDC00\uD834\uDF06\uDC00', '\xED\xB0\x80\xF0\x9D\x8C\x86\xED\xB0\x80'],
          ['\uDEEE', '\xED\xBB\xAE'],
          ['\uDFFF', '\xED\xBF\xBF'],
        ];
        tests.forEach(
            ([input, output]: [string, string]) => { expect(utf8Encode(input)).toEqual(output); });
      });
    });

    describe('stringify', () => {
      it('should pretty print an Object', () => {
        const result = stringify({hello: 'world'});
        expect(result).toBe('{"hello":"world"}');
      });

      it('should truncate large object', () => {
        const result = stringify({
          selector: 'app-root',
          preserveWhitespaces: false,
          templateUrl: './app.component.ng.html',
          styleUrls: ['./app.component.css']
        });
        expect(result).toBe(
            '{"selector":"app-root","preserveWhitespaces":false,"templateUrl":"./app.component.ng.html","styleUrl...');
      });
    });
  });
}
