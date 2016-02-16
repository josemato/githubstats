var request = require('request');

class WebService {
	/**
	 * @param String url to retrieve data
	 * @return Promise resolve with json data or rejected with the error
	 * */
	static doGetRequest(url) {
		console.log('retrieve data from', url)
		return new Promise((resolve, reject) => {
			request({
				url: url,
				headers: {
					'User-Agent': 'curl'
				}
			}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log('request resolved')
					resolve(body)
				} else {
					if(error) {
						return reject(error)	
					}

					if(body) {
						return reject(body);
					}
					
					return reject(null);
				}
			})
		})
	}
}

module.exports = WebService