const middleware = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
				.catch(next);
		},

	async searchAndFilterIngredients(req, res, next) {
		const queryKeys = Object.keys(req.query);
		if (queryKeys.length) {
			const dbQueries = [];
			let { search, title  } = req.query;

			if (search) {
				search = new RegExp(escapeRegExp(search), 'gi');
				dbQueries.push({ $or: [
					{ title: search }
				]});
			}

			if (title) {
				dbQueries.push({ title: { $in: title } });
			}

			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
		}

		res.locals.query = req.query;

		queryKeys.splice(queryKeys.indexOf('page'), 1);
		const delimiter = queryKeys.length ? '&' : '?';
		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

		next();
	},

	async searchAndFilterRecipes(req, res, next) {
		const queryKeys = Object.keys(req.query);
		if (queryKeys.length) {
			const dbQueries = [];
			let { search, title  } = req.query;

			if (search) {
				search = new RegExp(escapeRegExp(search), 'gi');
				dbQueries.push({ $or: [
						{ title: search }
					]});
			}

			if (title) {
				dbQueries.push({ title: { $in: title } });
			}

			if (preparation) {
				dbQueries.push({ preparation: { $in: preparation } });
			}

			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
		}

		res.locals.query = req.query;

		queryKeys.splice(queryKeys.indexOf('page'), 1);
		const delimiter = queryKeys.length ? '&' : '?';
		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

		next();
	}
};

module.exports = middleware;