import { Request, Response } from 'express';
import { Thought } from '../models/index.js';

/**
 * GET All Thoughts
*/
export const getAllThoughts = async(_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET Single thought by id
*/
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findById(thoughtId);
      if(thought) {
        res.json(thought);
      } else {
        res.status(404).json({
          message: 'thought not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  /**
 * POST a thought and push to associated user
*/
export const createThought = async (req: Request, res: Response) => {
  try {
    const { thoughtText, username } = req.body;

    if (!thoughtText || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newThought = await Thought.create({ thoughtText, username });

        return res.status(201).json(newThought);
    } catch (err) {
        // Handle errors and ensure there's always a return in the catch block
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        }

        // Add fallback response in case 'err' is not an instance of Error
        return res.status(500).json({ message: 'Unknown server error' });
    }
};

/**
 * PUT to update a thought by its _id
*/
export const updateThought = async (req: Request, res: Response) => {
    try {
      // const { thoughtText } = req.body;
      
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { thoughtText: req.body.thoughtText },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

  /**
 * DELETE to remove a thought by its _id
*/
export const deleteThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
      
      if(!thought) {
        res.status(404).json({
          message: 'No thought with that ID'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

/**
 * POST to create a reaction stored in a single thought's reactions array field
*/
export const addReaction = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $push: {
          reactions: {
            reactionBody,
            username
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    return res.json(updatedThought);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE to pull and remove a reaction by the reaction's reactionId value
*/
export const removeReaction = async (req: Request, res: Response) => {
  const { thoughtId, reactionId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $pull: {
          reactions: { reactionId: reactionId }
        }
      },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    return res.json({ message: 'Reaction removed', thought: updatedThought });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};