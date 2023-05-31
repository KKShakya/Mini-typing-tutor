export  const genWordlist = function (n, letters) {
  var results = [];

  var helper = function (cache, length) {
    if (length === n || results.length>=30) {
      results.push(cache);
      return;
    }

    for (var i = 0; i < letters.length; i++) {
      helper(cache + letters[i], length + 1);
    }
  };

  helper("", 0);
  return results.filter((words)=>words.length===n);
};



//to shuffle and make a list of words as per required combination
export const shuffleArray = (array, comb = 6)=> {
  let newArr = [];
  if (array.length < 6) {
    return [];
  }

  array.sort(() => Math.random() - 0.5);
  for (let i = 0; i < comb; i++) {
    newArr.push(array[i]);
  }
  return newArr;
}

///to make repition of same elements
export const repeat = (n = 4, arr)=>{
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(...arr)
  }

  return result.join(' ');

}


