export function openTab(name, tabName) {
  var i;
  var tab = name + "-tab";
  kultLogger("OpenTab =>", tab);
  var x = document.getElementsByClassName(tab);
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}
