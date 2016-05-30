const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

// Compute the bit code for a point (x, y) using the clip rectangle
// bounded diagonally by (xmin, ymin), and (xmax, ymax)
function ComputeOutCode(x, y, xmin, xmax, ymin, ymax)
{
	var code = INSIDE;      // initialised as being inside of clip window

	if (x <= xmin)           // to the left of clip window
		code |= LEFT;
	else if (x >= xmax)      // to the right of clip window
		code |= RIGHT;
	if (y <= ymin)           // above the clip window
		code |= TOP;
	else if (y >= ymax)      // below the clip window
		code |= BOTTOM;

	return code;
}

var iutils =  {

    // cohen-southerland clipping algorithm, but swizzled to clip the line outside
    // the rect, not within
    doLineRectIntersect: function(linein, rect) {
        var line = Object.assign({}, linein);   // so we don't mutate the incoming line

        // compute outcodes for P0, P1, and whatever point lies outside the clip rectangle
    	var outcode0 = ComputeOutCode(line.x0, line.y0, rect.left, rect.left + rect.width, rect.top, rect.top + rect.height);
    	var outcode1 = ComputeOutCode(line.x1, line.y1, rect.left, rect.left + rect.width, rect.top, rect.top + rect.height);
        var retcode = INSIDE;  // we are always moving from p0 and looking to clip p1

        while(true) {
    		if( !(outcode0 | outcode1) ) {   // both endpoints are inside the rect. Not really possible for our use case.
                break;
            }
            else if(outcode0 & outcode1) {    // both endpoints are outsid the rect and the line segment does not intersect the rect
                break;
            }
            else {
                // calculate the line segment to clip from outside point to intercection with rect
                let x, y;

                // at least one point is outside, pick it
                let outcodeOut = outcode0 ? outcode0 : outcode1;

                // now find intersection point of line an rect
                // y = y0 + slope * (x - x0), y = x= + (1 / slope) * (y - y0)
                if(outcodeOut & TOP) {
                    x = line.x0 + (line.x1 - line.x0) * (rect.top - line.y0) / (line.y1 - line.y0);
                    y = rect.top;
                    retcode |= TOP;
                }
                else if(outcodeOut & BOTTOM) {
                    x = line.x0 + (line.x1 - line.x0) * (rect.top + rect.height - line.y0) / (line.y1 - line.y0);
                    y = rect.top + rect.height;
                    retcode |= BOTTOM;
                }
                else if(outcodeOut & RIGHT) {
                    y = line.y0 + (line.y1 - line.y0) * (rect.left + rect.width - line.x0) / (line.x1 - line.x0);
                    x = rect.left + rect.width;
                    retcode |= RIGHT;
                }
                else if(outcodeOut & LEFT) {
                    y = line.y0 + (line.y1 - line.y0) * (rect.left - line.x0) / (line.x1 - line.x0);
                    x = rect.left;
                    retcode |= LEFT
                }

                // now move inside point to intersection point of clip and get ready for next pass
                if(outcodeOut === outcode0) {
                    // line p0 was already outside, clip line p1 ro edge of rect
                    line.x1 = x;
                    line.y1 = y;
                    outcode1 = ComputeOutCode(line.x1, line.y1, rect.left, rect.left + rect.width, rect.top, rect.top + rect.height);
                }
                else {
                    // line p1 was outside, clip line p0 to edge of rect
                    line.x0 = x;
                    line.y0 = y;
                    outcode0 = ComputeOutCode(line.x0, line.y0, rect.left, rect.left + rect.width, rect.top, rect.top + rect.height);
                }
            }
        }

    	return retcode;
    },
    pointInRect: function(pt, rect) {
        return pt.x >= rect.left && pt.x <= rect.left + rect.width
            && pt.y >= rect.top && pt.y <= rect.top + rect.height;
    }
};

exports.intersectUtils = iutils;
exports.NOINTERSECT = INSIDE;
exports.LEFT = LEFT;
exports.RIGHT = RIGHT;
exports.TOP = TOP;
exports.BOTTOM = BOTTOM;
