Ext.ns('GWDP.ui.formatters');

/**
 * Formatters are functions that convert data to human-readable formats.
 * These are particularly useful in XTemplates and Ext grids
 */

GWDP.ui.formatters = new function(){
    var self = this;
    var inFeetOrNbsp = function(height){
        var retStr = "&nbsp;" //default value

        if(GWDP.utils.isNumber(height)){
            var decimalPlaces = 2;
            var suffix = " ft.";
            retStr = (height * 1.0).toFixed(decimalPlaces) + suffix;
        }
        return retStr;
    };

    var positionDelimiter = /[ ,]/,
        positionDecimalPlaces = 4,
        latIndex = 1,
        longIndex = 0;

    var positionToFixedLoc = function(string, index){
        return parseFloat(string.split(positionDelimiter)[index]).toFixed(positionDecimalPlaces);
    };
    var positionToLat = function(position){
        return positionToFixedLoc(position, latIndex);
    };
    var positionToLong = function(position){
        return positionToFixedLoc(position, longIndex);
    };

    return {
        inFeetOrNbsp: inFeetOrNbsp,
        positionToLat: positionToLat,
        positionToLong: positionToLong
    };
};