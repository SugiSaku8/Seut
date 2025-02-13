let size;
import readline from "readline";
import dispress from "./progress/progress.js"
export const init = function (a, type,size) {
  switch (type) {
    case "memory":
      init_ram(a,size);
      break;
    case "storage":
      init_storage(a,size);
      break;
    default:
      console.error(
        "Sort System Error:\nAn error occurred while sorting " +
          type +
          "." +
          "\n" +
          type +
          " cannot be initialized with SORT."
      );
  }
};

export function init_ram(a,size) {
  const ramrl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  dispress(0,"Memory initialization progress: ")
  size = a.size;
  dispress(1,"Memory initialization progress: ")
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  dispress(2,"Memory initialization progress: ")
  const numbers = Array.from({ length: size }, (_, i) => i.toString());
  dispress(3,"Memory initialization progress: ")
  let counter = 0;
  dispress(4,"Memory initialization progress: ")
  let res = 4
  for (let char of alphabet) {
    if (counter >= size) break;
    a[`a.${char}`] = null;
    counter++;
  }
  dispress(52,"Memory initialization progress: ")
  for (let num of numbers) {
    for (let char of alphabet) {
      if (counter >= size) break;
      a[`a.${char}${num}`] = null;
      counter++;
    }
    if (counter >= size) break;
  }
  dispress(100,"Memory initialization progress: ")
  return a;
}

export function init_storage(a,size) {
  size = a.size;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = Array.from({ length: size }, (_, i) => i.toString());
  let counter = 0;
  for (let char of alphabet) {
    if (counter >= size) break;
    a[`a.${char}`] = null;
    counter++;
  }
  for (let num of numbers) {
    for (let char of alphabet) {
      if (counter >= size) break;
      a[`a.${char}${num}`] = null;
      counter++;
    }
    if (counter >= size) break;
  }
  return a;
}

export function get_blank(obj) {
  return Object.keys(obj).find((key) => obj[key] === null);
}

export function get_ntn_blank(obj) {
  const keys = Object.keys(obj);
  const firstEmpty = get_blank(obj);
  const index = keys.indexOf(firstEmpty);
  return index !== -1 ? keys[index + 1] : null;
}

//export default init;
