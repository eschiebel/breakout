export default {
	urlParams: {},

	parseParams: function() {
	    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

	    this.urlParams = {};

	    while (match = search.exec(query)) {
	       this.urlParams[decode(match[1])] = decode(match[2]);
	    }
	},
	// get the value of the incomming parameter name.
	// if not in URL query_string, return default, or null
	get: function(param, /*optional*/ default_value) {
		var value = default_value;
		if(param in this.urlParams) {
			value = this.urlParams[param];
		}
		return value;
	},

}
