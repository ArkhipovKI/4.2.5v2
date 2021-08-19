import '../scss/style.scss'
import { getRepositoriesURL, debounce } from './utils'

const search = document.getElementById('mySearch')
const list = document.querySelector('.autocomplete-list')

const clearResults = () => {
	list.innerHTML = ''
}

const clearInfo = () => {
	const preview = document.querySelector('.repo-preview')
	if (preview) {
		preview.remove()
	}
}

const generateRepoItem = (name) => {
	const el = document.createElement('li')
	el.className = 'autocomplete-item'
	el.innerText = name
	return el
}

const generateRepoInfoElement = (name, login, stars) => {
	const repItem = document.createElement('div')
	repItem.className = 'repo-preview'
	const content = document.createElement('p')
	content.className = 'repo-preview--content'
	content.innerHTML = `Name: ${name}<br>Owner: ${login}<br>Stars: ${stars}`
	const closeBtn = document.createElement('button')
	closeBtn.className = 'repo-preview--btn'
	closeBtn.setAttribute('type', 'button')
	closeBtn.innerHTML = '<span>×</span>'
	closeBtn.addEventListener('click', () => repItem.remove(), { once: true })
	repItem.append(content, closeBtn)
	return repItem
}

const showSearchResult = (repositories) => {
	clearResults()

	const repositoriesElements = repositories.map(({ name, owner, stargazers_count }) => {
		const el = generateRepoItem(name)

		list.addEventListener('click', function addItem(e) {
			if (e.target === el) {
				console.log(el)
				const repItem = generateRepoInfoElement(name, owner.login, stargazers_count)
				document.body.appendChild(repItem)
				search.value = '';
			}
			clearResults();
			this.removeEventListener('click', addItem);
			e.target.removeEventListener('click', addItem)
		}, { once: true })
		return el
	})

	list.replaceChildren(...repositoriesElements)
}

const getAndShowRepositories = async () => {
	const searchQuery = search.value.trim()

	if (searchQuery.length === 0) {
		clearResults()
		return
	}

	const response = await fetch(getRepositoriesURL(searchQuery))
	const repositories = await response.json()
	showSearchResult(repositories.items)
}

search.addEventListener('input', debounce(getAndShowRepositories, 300))
