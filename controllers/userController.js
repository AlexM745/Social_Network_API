// importing the User model
const { User, Thought } = require("../models");

// the user controller object that has various handlers for api calls
const UserController = {

  // get all users
  async getUsers(req, res) {
    try {
      const user = await User.find();
      res.status(200).json(user);;
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get one user by their id
  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      res.status(200).json(user);;
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //create user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update user by id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //delete user by id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId});

      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
      }
        // deletes the thoughts assoiated with user
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and associated thoughts deleted!' });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

//(api/user/friends/:id)
  //add friend to user
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        // aggregating to the db to add a friend 
        { $addToSet: { friends: req.body.friendId || req.params.friendId } },
        
      );
      if (!user) {
        res.status(404).json({ message: "No user found with this id!" });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

//(api/user/friends/:id)
  //delete friend of user
  async deleteFriend(req, res) {
    try {
      const user = await User.updateOne(
        { _id:req.params.userId}, { $pull: { friends: req.params.friendId }}
      );

      if (!user) {
        res.status(404).json({ message: "No user found with this id!" });
      }
      res.json({message: "deleted friend"});

    } catch (err) {
      res.status(500).json(err);
    }
  }

};


// exporting the user controller
module.exports = UserController;
