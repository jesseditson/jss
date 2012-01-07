module.exports = function trim(str) {
        return str.toString().replace(/^\s+|\s+$/g,"");
}