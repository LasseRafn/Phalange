var fs = require('fs');

var errorBagData;

/*
 * This is a ugly mess.
 * Todo: Fix later
 */
fs.readFile('src/ErrorBag.js', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}

	data = data.replace('export default {ErrorBag};', '');
	data = data.replace('export {ErrorBag};', '');

	errorBagData = data;

	fs.readFile('src/Phalange.js', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		var result = data.replace('import ErrorBag from "./ErrorBag";', errorBagData);

		fs.writeFile('src/index.js', result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
});