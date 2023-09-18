const router = require('express').Router();
const {
  getSingleThought,
  getThoughts,
  createThought,
  getReactions,
  createReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought);

router.route('/:thoughtId/reactions').get(getReactions).post(createReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
