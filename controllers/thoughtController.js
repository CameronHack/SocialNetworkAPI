const { Thought, User, Reaction } = require('../models');

module.exports = {

  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .populate('reactions');
      

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought created, but found no user with that ID' });
      }

      res.json('Created the Thought');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const reaction = await Reaction.create(req.body);
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: reaction._id } },
        { new: true }
      );

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      await Reaction.deleteOne({ _id: req.params.reactionId });

      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });
  
      thoughtData.reactions = thoughtData.reactions.filter(reactionId => reactionId != req.params.reactionId);
  
      await thoughtData.save();

      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      await Thought.updateOne({ _id: req.params.thoughtId }, { $set: req.body });
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thoughtData = await Thought.deleteOne({ _id: req.params.thoughtId });
      
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
};
