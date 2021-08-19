export function getRepositoriesURL (count) {
  return `https://api.github.com/search/repositories?q=${count}in:name&per_page=5&sort=stars`
}

export function debounce (fn, debounceTime)  {
  let deb;
  return function () {
    clearTimeout(deb)
    deb = setTimeout(() => fn.apply(this, arguments), debounceTime)
  }
}
