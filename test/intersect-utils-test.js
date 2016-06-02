"use-strict";
import {intersectUtils, NOINTERSECT, LEFT, RIGHT, TOP, BOTTOM} from '../src/js/utils/intersect-utils';
var chai = require('chai');

let expect = chai.expect;
let should = chai.should();


describe('intersect-utils', () => {

    var rect = {left: 100, width: 100, top: 100, height: 50};

    it('should not intersect, parallel above', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 50, y0: 50, x1: 250, y1: 50}, rect);
        expect(retval).to.be.equal(NOINTERSECT);
    });
    it('should not intersect, parallel below', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 50, y0: 250, x1: 250, y1: 250}, rect);
        expect(retval).to.be.equal(NOINTERSECT);
    });
    it('should not intersect, parallel to left', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 50, y0: 50, x1: 50, y1: 250}, rect);
        expect(retval).to.be.equal(NOINTERSECT);
    });
    it('should not intersect, parallel to right', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 250, y0: 50, x1: 250, y1: 250}, rect);
        expect(retval).to.be.equal(NOINTERSECT);
    });
    it('should not intersect, completely within', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 125, y0: 125, x1: 175, y1: 125}, rect);
        expect(retval).to.be.equal(NOINTERSECT);
    });

    it('intersects, from above', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 125, y0: 50, x1: 175, y1: 200}, rect);
        expect(retval).to.be.equal(TOP);
    });
    it('intersects, from below', function () {
        var retval = intersectUtils.doLineRectIntersect({x1: 125, y1: 50, x0: 175, y0: 200}, rect);
        expect(retval).to.be.equal(BOTTOM);
    });
    it('intersects, from left', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 25, y0: 125, x1: 175, y1: 125}, rect);
        expect(retval).to.be.equal(LEFT);
    });
    it('intersects, from right', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 225, y0: 125, x1: 175, y1: 125}, rect);
        expect(retval).to.be.equal(RIGHT);
    });
    it('intersects, on upper-left corner', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 25, y0: 50, x1: 101, y1: 101}, rect);
        expect(retval).to.be.equal(TOP|LEFT);
    });
    it('intersects, on upper-right corner', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 250, y0: 75, x1: 198, y1: 102}, rect);
        expect(retval).to.be.equal(TOP|RIGHT);
    });
    it('intersects, on lower-left corner', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 75, y0: 175, x1: 102, y1: 149}, rect);
        expect(retval).to.be.equal(BOTTOM|LEFT);
    });
    it('intersects, on lower-right corner', function () {
        var retval = intersectUtils.doLineRectIntersect({x0: 250, y0: 175, x1: 198, y1: 149}, rect);
        expect(retval).to.be.equal(BOTTOM|RIGHT);
    });
})
