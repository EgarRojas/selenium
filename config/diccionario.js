var Enum = require('enum');

var myEnum = new Enum({
    'ErrorRut': 'Alert text : Ingrese un RUT válido', 
    'NoPodemosAtenderlo': 'En estos momentos no podemos atenderlo, inténtelo más tarde.', 
    'ClaveValida': 'su clave es valida, ups'
});

module.exports = {
    diccionario: myEnum
  }