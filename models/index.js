const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./users');
const GMember = require('./gmembers');
const Board = require('./boards');
const Post = require('./posts');
const Comment = require('./comments');
const Room = require('./rooms');
const Reserv = require('./reservs');

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.GMember = GMember;
db.Board = Board;
db.Post = Post;
db.Comment = Comment;
db.Room = Room;
db.Reserv = Reserv;

User.init(sequelize);
GMember.init(sequelize);
Board.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Room.init(sequelize);
Reserv.init(sequelize);

User.associate(db);
GMember.associate(db);
Board.associate(db);
Post.associate(db);
Comment.associate(db);
Room.associate(db);
Reserv.associate(db);

module.exports = db;