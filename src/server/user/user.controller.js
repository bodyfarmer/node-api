import User from './user.model';

const bcrypt = require('bcryptjs');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const id = req.params.userId;
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.mobileNumber = req.body.mobileNumber;
    user.dob = req.body.dob;
    user.street = req.body.street;
    user.city = req.body.city;
    user.state = req.body.state;
    user.zip = req.body.zip;


    user.save().then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  });
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {

  const pageNum = (req.query.page === undefined) ? 1 : req.query.page;
  const itemPerPage = (req.query.limit === undefined) ? 10 : Number(req.query.limit);

  delete req.query.page;
  delete req.query.limit;

  // search params handling
  const query = [
    { $match: req.query },
    {
      $group: {
        _id: null,
        data: { $push: '$$ROOT' },
        count: { $sum: 1 },
      }
    },
    {
      $unwind: '$data'
    },
    { $skip: (pageNum - 1) * itemPerPage },
    { $limit: itemPerPage },
    {
      $group: {
        _id: null,
        total: {
          $first: '$count'
        },
        results: {
          $push: '$data'
        }
      }
    }
  ];

  User.list(query)
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}


export default {
  load, get, create, update, list, remove
};
