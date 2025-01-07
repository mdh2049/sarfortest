class Utils {
  static camelToSnake(str) {
    if (str === null || str === undefined) {
      return "";
    }

    return str.replace(/[\w]([A-Z])/g, (m) => m[0] + "_" + m[1]).toLowerCase();
  }

  static snakeToCamel(str) {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  static isNull(obj){
    return (obj === null || obj === undefined);
  }

  static isNotNull(obj){
    return !Utils.isNull(obj);
  }

  /** 첫 글자를 대문자로 변환 */
  static capitalize(str) {
    if(str === null || str === undefined){
      return '';
    }

    if(str.length === 1){
      return str.toUpperCase();
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
