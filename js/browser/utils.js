let size;
export const init = function(a, type) {
  switch (type) {
    case "memory":
      init_ram(a);
      break;
    case "storage":
      init_storage(a);
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
}

export  function init_ram(a) {
  size = a.size;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = Array.from({ length: 100000000 }, (_, i) => i.toString());
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

export  function init_storage(a) {
  size = a.size;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = Array.from({ length: 256 }, (_, i) => i.toString());
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

export  function get_blank(obj) {
  return Object.keys(obj).find((key) => obj[key] === null);
}

export  function get_ntn_blank(obj) {
  const keys = Object.keys(obj);
  const firstEmpty = get_blank(obj);
  const index = keys.indexOf(firstEmpty);
  return index !== -1 ? keys[index + 1] : null;
}

//export default init;