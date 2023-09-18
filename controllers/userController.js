const User = require('../models/User');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const dbUserData = await User.updateOne({ _id: req.params.userId }, { $set: req.body });
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const dbUserData = await User.deleteOne({ _id: req.params.userId });
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const friendData = await User.findOne({ _id: req.params.friendId })

      await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: friendData._id } },
        { new: true }
      );
        
      const userData = await User.findOne({ _id: req.params.userId })
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId });
  
      userData.friends = userData.friends.filter(friendId => friendId != req.params.friendId);
  
      await userData.save();
  
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
