import { Request, Response } from 'express';
import mongoose from 'mongoose'
import { User } from '../models/index.js';

// // Aggregate function to get number of users

export const headCount = async () => {
    const numberOfUsers = await User.aggregate()
        .count('UserCount');
    return numberOfUsers;
}

/**
 * GET All Users
*/
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();

        const userObj = {
            users,
            headCount: await headCount(),
        }

        res.json(userObj);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET Single User by ID & populated thought and friend data
*/
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('thoughts').populate('friends');
        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST a new user
*/

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;

        // Basic validation (optional, Mongoose will also handle it)
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        const newUser = await User.create({ username, email });

        // Always return a response
        return res.status(201).json(newUser);
    } catch (err) {
        // Handle errors and ensure there's always a return in the catch block
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        }

        // Add fallback response in case 'err' is not an instance of Error
        return res.status(500).json({ message: 'Unknown server error' });
    }
}

/**
 * PUT to update a user by its id
*/

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            {_id: req.params.userId },
            { username },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'No user exists with that ID' });
        }

        return res.json(updatedUser);
    } catch (err) {
        console.error(err);

        if (err instanceof Error && 'code' in err && (err as any).code === 11000) {
            return res.status(409).json({ message: 'Username or email already in use' });
        }

        return res.status(500).json({ message: 'Server error', error: (err as any).message || err });
    }
}


/**
 * DELETE user by id
*/

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user exists' });
        }
        return res.json({ message: 'User successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

/**
 * POST to add a new friend to a user's friend list
*/
export const addFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ message: 'Invalid userId or friendId' });
      }
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }
  
      // Compare IDs using .toString() to avoid ObjectId type conflicts
      const alreadyFriend = user.friends.some(id => id.toString() === friendId);
  
      if (alreadyFriend) {
        return res.status(400).json({ message: 'Friend already added' });
      }
  
      user.friends.push(friend._id); // this is already an ObjectId
      await user.save();
  
      return res.json({ message: 'Friend added successfully', user });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

/**
 * DELETE to remove a friend from a user's friend list
*/

export const removeFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Friend removed', user });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};