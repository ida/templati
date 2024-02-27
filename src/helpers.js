module.exports.titlelize = function titlelize(string) {
  // 'add-item' -> 'Add item'
  string = string[0].toUpperCase() + string.slice(1)
  string = string.replace(/-/g, ' ')
  return string
}

