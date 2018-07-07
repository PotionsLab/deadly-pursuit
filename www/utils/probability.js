export const valuesSetIntoPercetages = (array) => {
	const length = array.length;
	const sum = array.reduce((a, b) => a + b);

	return array.map((element) => {
		return ((element / sum) * 100).toFixed(1) + "%";
	})
};
