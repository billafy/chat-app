export const hasAlpha = (string) => {
	if(isNaN(Number(string)))
		return true;
	return false;
}

export const isAlphaNumeric = (string) => {
	let alpha = false, num = false;
	for(let i=0;i<string.length;++i) {
		if(isNaN(Number(string[i])))
			alpha = true;
		else
			num = true;
	}
	return alpha && num;
}
export const validateDate = (date) => {
	const year = new Date(date).getFullYear();
	const currentYear = new Date().getFullYear();
	if(Number(year) > Number(currentYear) || Number(currentYear)-Number(year)>100)
		return 'INVALID';
	if(Number(currentYear)-Number(year)<=3)
		return 'UNDER3';
	return 
}