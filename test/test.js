import test from "ava";
import sinon from "sinon";
import Phalange from "../dist/phalange.umd";

const fetch = require('unfetch');
global.fetch = fetch;

let xhr = {
	setRequestHeader: sinon.spy(),
	getAllResponseHeaders: sinon.stub().returns('X-Foo: bar\nX-Foo:baz'),
	open: sinon.spy(),
	send: sinon.spy(),
	status: 200,
	statusText: 'OK',
	responseText: '{"message":"OK"}',
	responseURL: '/'
};

let xhrText = {
	setRequestHeader: sinon.spy(),
	getAllResponseHeaders: sinon.stub().returns('X-Foo: bar\nX-Foo:baz'),
	open: sinon.spy(),
	send: sinon.spy(),
	status: 200,
	statusText: 'OK',
	responseText: 'Success',
	responseURL: '/'
};

let failedXhr = {
	setRequestHeader: sinon.spy(),
	getAllResponseHeaders: sinon.stub().returns('X-Foo: bar\nX-Foo:baz'),
	open: sinon.spy(),
	send: sinon.spy(),
	status: 403,
	statusText: 'FAIL',
	responseText: '{"name":["Name is required."]}',
	responseURL: '/'
};

let failedXhrText = {
	setRequestHeader: sinon.spy(),
	getAllResponseHeaders: sinon.stub().returns('X-Foo: bar\nX-Foo:baz'),
	open: sinon.spy(),
	send: sinon.spy(),
	status: 403,
	statusText: 'FAIL',
	responseText: 'Some random error happened',
	responseURL: '/'
};

global.XMLHttpRequest = sinon.stub().returns(xhr);

test('should return form data as an Object, key string based', function (t) {
	let formFields = {
		name: "Lasse Rafn",
		email: ""
	};

	let expectedFormFields = {
		name: "Lasse Rafn",
		email: "lasserafn@gmail.com"
	};

	const form = new Phalange('', formFields);

	form.fields.email = "lasserafn@gmail.com";

	t.true(JSON.stringify(form.data()) === JSON.stringify(expectedFormFields));
});


test('should clear all fields', function (t) {
	let formFields = {
		name: "Lasse Rafn",
		email: ""
	};

	let expectedFormFields = {
		name: "",
		email: ""
	};

	const form = new Phalange('', formFields);

	form.clear();

	t.true(JSON.stringify(form.data()) === JSON.stringify(expectedFormFields));
});

test('should reset fields to original state', function (t) {
	let formFields = {
		name: "Lasse Rafn",
		email: "JohnDoe@gmail.com"
	};

	let expectedFormFields = {
		name: "Lasse Rafn",
		email: "JohnDoe@gmail.com"
	};

	const form = new Phalange('', formFields);

	form.fields.name = "John Doe";

	form.reset();

	t.true(JSON.stringify(form.data()) === JSON.stringify(expectedFormFields));
});

test('form submit should be called on post,delete,put', function (t) {
	const form = new Phalange('/', {});

	form.submit = sinon.spy();

	form.post();
	form.delete();
	form.put();

	t.true(form.submit.callCount === 3)
});

test('failed submit should return errors, and set errors', function (t) {
	global.XMLHttpRequest = sinon.stub().returns(failedXhr);
	const form = new Phalange('/', {});

	const response = form.post();

	failedXhr.onload();

	return response.then(function (data) {
		t.fail();
	}).catch(function (errors) {
		t.true(JSON.stringify(errors) === '{"name":["Name is required."]}');
		t.true(form.errors.get('name').length === 1);
		t.true(form.errors.count() === 1);
	});
});

test('successful submit should return message, and reset errors', function (t) {
	global.XMLHttpRequest = sinon.stub().returns(xhr);
	const form = new Phalange('/', {});

	const response = form.post();

	xhr.onload();

	return response.then(function (data) {
		t.true(JSON.stringify(data) === '{"message":"OK"}');
		t.true(form.errors.count() === 0);
	}).catch(function (errors) {
		t.fail();
	});
});

test('failed submit (with non-json response) should return error, and set error - from responseText', function (t) {
	global.XMLHttpRequest = sinon.stub().returns(failedXhrText);
	const form = new Phalange('/', {});

	const response = form.post();

	failedXhrText.onload();

	return response.then(function (data) {
		t.fail();
	}).catch(function (errors) {
		t.true(errors === "Some random error happened");
		t.true(form.errors.get('general').length === 1);
		t.true(form.errors.count() === 1);
	});
});

test('success submit (with non-json response) should return response, and reset errors', function (t) {
	global.XMLHttpRequest = sinon.stub().returns(xhrText);
	const form = new Phalange('/', {});

	const response = form.post();

	xhrText.onload();

	return response.then(function (data) {
		t.true(data === "Success");
		t.true(form.errors.count() === 0);
	}).catch(function (errors) {
		t.fail();
	});
});

test('form resets if asked to', function (t) {
	global.XMLHttpRequest = sinon.stub().returns(xhr);

	const form = new Phalange('/', {
		name: "Lasse Rafn",
		email: ""
	}, {
		resetOnSuccess: true
	});

	form.fields.name = "John Doe";
	form.fields.email = "demo@gmail.com";

	const response = form.post();
	xhr.onload();

	return response.then(function () {
		t.true(form.fields.name === "Lasse Rafn");
		t.true(form.fields.email === "");
	});
});

test('form can clear', function (t) {
	const form = new Phalange('/', {
		name: "Lasse Rafn",
		email: ""
	});

	form.fields.email = "demo@gmail.com";

	form.clear();

	t.true(form.fields.name === "");
	t.true(form.fields.email === "");
});

test('ErrorBag can clear errors and single errors', function (t) {
	const form = new Phalange('/', {
		name: "Lasse Rafn",
		email: ""
	});

	form.errors.set({name: "Something went wrong!"});
	form.errors.clear();

	t.true(form.errors.count() === 0);


	form.errors.set({name: "Something went wrong!"});
	form.errors.clear('name');

	t.true(form.errors.count() === 0);
});

test('Errorbag can set errors', function (t) {
	const form = new Phalange('/', {
		name: ""
	});

	form.errors.set({name: "Something went wrong!"});

	t.true(form.errors.first('name') === 'Something went wrong!');
});

test('Errorbag can has errors', function (t) {
	const form = new Phalange('/', {
		name: ""
	});

	form.errors.set({name: "Something went wrong!"});

	t.true(form.errors.has('name'));
});

test('Can set custom headers', function (t) {
	const form = new Phalange('/', {}, {
		headers: {
			"X-TEST": true
		}
	});

	t.true(JSON.stringify(form.headers) === "{\"Content-Type\":\"application/json\",\"X-TEST\":true}");
});

test('Fields can have default values', function (t) {
	const form = new Phalange('/', {
		full_name: "John Doe",
		email: "",
	});

	t.true(form.fields.full_name === "John Doe");
	t.true(form.fields.email === "");
});
