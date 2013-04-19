Ext.ns('GWDP.utils');

GWDP.utils = new function(){
  var self = this;
  
  /**
   * @param n - mixed
   * @returns boolean whether 'n' is a number
   * @note this has been run against 30+ unit tests and is the vetted winner of
   * the following stack overflow post. Change with caution.
   * @url http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
   */
  var isNumber = function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
  };
  
  //explicitly specify the public-facing properties:
  return {
      isNumber: isNumber
  };
};