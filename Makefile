npm-modules:
	npm install

data/articlesUrls.csv: npm-modules
	node bin/getUrls.js

raw-html: data/articlesUrls.csv
	mkdir raw-html
	node bin/getArticles.js

data/articles.csv: raw-html
	node bin/parseArticles.js