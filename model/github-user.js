const WebService = require('../service/web-service')

class GithubUser {
	/**
	 * @param String username 
	 * */
	constructor(username) {
		this.username = username
		this.repos = []
		this.stats = []
	}

	/**
	 * @return Promise resolve with array of repos objects or reject error
	 * Fetch user repositories from github and cache on memory. Clear previous stats when new fetch appears.
	 * */
	fetchRepositories() {
		let url = `https://api.github.com/users/${this.username}/repos`

		return new Promise((resolve, reject) => {
			if(this.repos.length !== 0) {
				return process.nextTick(() => {
					return resolve(this.repos)
				})
			}

			WebService.doGetRequest(url).then((repos) => {
				try {
					// cache repos in this execution context and clear previous stats
					this.repos = JSON.parse(repos)
					resolve(this.repos)
				} catch(err) {
					reject(err);
				}
			}).catch((err) => {
				reject(err)
			})
		})
	}

	/**
	 * @return Promise resolve with array of favourites language with stats
	 * Calcuate user favourite language (could be an array because could have same language preferences), 
	 * and cache on memory.
	 * */
	calculateStats() {
		return new Promise((resolve, reject) => {
			if(this.repos.length === 0) {
				return  process.nextTick(() => {
					return resolve(this.stats);
				});
			}

			// temporal structure to store 'language' with 'counter'
			let tmpLanguages = {

			};

			// save max counter of the favourite language
			let maxCounter = 0
			let currentLanguage = null

			this.repos.forEach((repo) => {
				currentLanguage = repo.language
				tmpLanguages[currentLanguage] = (tmpLanguages[currentLanguage] | 0) + 1

				if(maxCounter < tmpLanguages[currentLanguage]) {
					maxCounter = tmpLanguages[currentLanguage]
				}
			})

			// get favourite languages and store on cache
			Object.keys(tmpLanguages).forEach((language) => {
				if(tmpLanguages[language] === maxCounter) {
					this.stats.push({
						language: language,
						counter: tmpLanguages[language]
					})
				}
			})

			resolve(this.stats)
		})
	}
}


module.exports = GithubUser