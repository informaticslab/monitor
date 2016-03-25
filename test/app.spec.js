import chai from 'chai';
import { expect } from 'chai';

const request = require('request');
const base_url = 'http://localhost:3000/'

describe('GET /', () => {
	it('returns status code 200', () => {
		request(base_url, (error, res, body) => {
			expect(res.statusCode).to.equal(200);
		});
	});
});