const argv = require('yargs').argv
const GithubUser = require('./model/github-user')

/**
 * Validate name variable passed to the script. It's mandatory write a github username
 * */
if(!argv.name || argv.name === true) {
	console.log('node --harmony index.js --name <github username>')
	process.exit(0)
}

const githubUsername = argv.name
const user = new GithubUser(githubUsername)

user.fetchRepositories().then((repos) => {
	return user.calculateStats()
}).then((stats) => {
	console.log('==============================')
	console.log('User favourites languages')
	console.log('==============================')
	stats.forEach((stat) => {
		console.log(`${stat.language}: ${stat.counter}`)
	})
}).catch((err) => {
	console.log('error', err)
})