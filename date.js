module.exports = function(){
  var today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // console.log(today.toLocaleDateString("de-DE", options));
  // var current = today.getDay();
  var day = today.toLocaleDateString("en-US",options);
  return day;

}
