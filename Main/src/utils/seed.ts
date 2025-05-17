import User from '../models/User.js';
import Thought from '../models/Thought.js';
import { users, thoughts, friendsMap } from './data.js'; 
import db from '../config/connection.js';

const seed = async () => {
  try {
    db.once('open', async () => {
      console.log('Connected to MongoDB');

      // Clear existing data
      await User.deleteMany({});
      await Thought.deleteMany({});

      // Insert users
      const createdUsers = await User.insertMany(users);
      const userMap = new Map(
        createdUsers.map(user => [
            user.username,
             user
            ])
      );
      console.log(`Inserted ${createdUsers.length} users`);

      // Insert thoughts
      for (const thought of thoughts) {
        console.log(`Processing thought: ${thought.thoughtText} by ${thought.username}`);
        const user = userMap.get(thought.username);

        if (!user) {
          console.warn(`Skipping thought: User not found for username '${thought.username}'`);
          continue;
        }

        // Validate each reaction has a username
        const validReactions = (thought.reactions || []).map(reaction => {
          const reactionUser = userMap.get(reaction.username);
          if (!reactionUser) {
            console.warn(`Skipping reaction: User '${reaction.username}' not found`);
            return null;
          }
          return {
            reactionBody: reaction.reactionBody,
            username: reaction.username,
            createdAt: new Date(),
          };
        }).filter(Boolean); // Filter out null values

        const newThought = await Thought.create({
          thoughtText: thought.thoughtText,
          username: user.username,
          createdAt: new Date(),
          reactions: validReactions,
        });

        // Update the user's thoughts array with the new thought ID
        await User.findByIdAndUpdate(user._id, {
          $push: { thoughts: newThought._id },
        });
      }

      // Add friends
      for (const [username, friendUsernames] of Object.entries(friendsMap)) {
        const user = userMap.get(username);
        if (!user) {
          console.warn(`User not found for friends mapping:'${username}'`);
          continue;
        }

        const friendIds = friendUsernames
          .map(friendName => userMap.get(friendName)?._id)
          .filter(Boolean);

        await User.findByIdAndUpdate(user._id, {
          $addToSet: { friends: { $each: friendIds } },
        });
      }

      console.log('Database seeded successfully!');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error seeding the database:', err);
    process.exit(1);
  }
};

seed();