export default function generateReverseDictionary(dictionary) {
  var reverseDictionary = {};
  
  for (var key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      var value = dictionary[key];
      reverseDictionary[value] = key;
    }
  }
  
  return reverseDictionary;
}