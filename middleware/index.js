const middleware = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
				.catch(next);
		},

	async searchAndFilterIngredients(req, res, next) {
		// pull keys from req.query (if there are any) and assign them
		// to queryKeys variable as an array of string values
		const queryKeys = Object.keys(req.query);
		/*
			check if queryKeys array has any values in it
			if true then we know that req.query has properties
			which means the user:
			a) clicked a paginate button (page number)
			b) submitted the search/filter form
			c) both a and b
		*/
		if (queryKeys.length) {
			// initialize an empty array to store our db queries (objects) in
			const dbQueries = [];
			// destructure all potential properties from req.query
			let { search, title  } = req.query;
			// check if search exists, if it does then we know that the user
			// submitted the search/filter form with a search query
			if (search) {
				// convert search to a regular expression and
				// escape any special characters
				search = new RegExp(escapeRegExp(search), 'gi');
				// create a db query object and push it into the dbQueries array
				// now the database will know to search the title, description, and location
				// fields, using the search regular expression
				dbQueries.push({ $or: [
						{ title: search }
					]});
			}
			// check if title exists, if it does then we know that the user
			// submitted the search/filter form with a title query
			if (title) {
				// create a db query object that finds any post documents where the avgRating
				// value is included in the avgRating array (e.g., [0, 1, 2, 3, 4, 5])
				dbQueries.push({ title: { $in: title } });
			}

			// pass database query to next middleware in route's middleware chain
			// which is the postIndex method from /controllers/postsController.js
			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
		}
		// pass req.query to the view as a local variable to be used in the searchAndFilter.ejs partial
		// this allows us to maintain the state of the searchAndFilter form
		res.locals.query = req.query;

		// build the paginateUrl for paginatePosts partial
		// first remove 'page' string value from queryKeys array, if it exists
		queryKeys.splice(queryKeys.indexOf('page'), 1);
		/*
			now check if queryKeys has any other values, if it does then we know the user submitted the search/filter form
			if it doesn't then they are on /posts or a specific page from /posts, e.g., /posts?page=2
			we assign the delimiter based on whether or not the user submitted the search/filter form
			e.g., if they submitted the search/filter form then we want page=N to come at the end of the query string
			e.g., /posts?search=surfboard&page=N
			but if they didn't submit the search/filter form then we want it to be the first (and only) value in the query string,
			which would mean it needs a ? delimiter/prefix
			e.g., /posts?page=N
			*N represents a whole number greater than 0, e.g., 1
		*/
		const delimiter = queryKeys.length ? '&' : '?';
		// build the paginateUrl local variable to be used in the paginatePosts.ejs partial
		// do this by taking the originalUrl and replacing any match of ?page=N or &page=N with an empty string
		// then append the proper delimiter and page= to the end
		// the actual page number gets assigned in the paginatePosts.ejs partial
		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
		// move to the next middleware (postIndex method)
		next();
	}
};

module.exports = middleware;