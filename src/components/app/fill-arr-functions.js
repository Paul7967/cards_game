const rand = (max, min, length) => {
	const result = [];
	const resultSorted = [];
  
	  for(let j = 0, random, index; j < length; j++, max--){
		  random = Math.floor(Math.random() * (max - min + 1)) + min;
  
		  for(index = j; index && resultSorted[index-1] <= random; index--) random++; 
  
		  result.push(random);
		  resultSorted.splice(index, 0, random);
	  }
  
	  return result;
  };

const GetPicturesArray = (countPairs) => {
	const min = Math.floor(Math.random() * 18);
	const max = min + countPairs -1;
	const arr1 = rand(max, min, countPairs);
	const arr2 = rand(max, min, countPairs);
  
	const result = [];
	
	for (let i=0, cardNum=0;i<countPairs;i++){
		result.push({'cardNum':cardNum, 'picNum':arr1[i], 'hidden':true, 'deleted':false});
		result.push({'cardNum':cardNum+1, 'picNum':arr2[i], 'hidden':true, 'deleted':false});
		cardNum +=2;
	};

	return result;
};

export default GetPicturesArray;