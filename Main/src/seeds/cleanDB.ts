import { Thought, User } from '../models/index.js';

const cleanDB = async (): Promise<void> => {
  try {
    await Thought.deleteMany({});
    console.log('Thought collection cleaned.');

    await User.deleteMany({});
    console.log('User collection cleaned.');

  } catch (err) {
    console.error('Error cleaning collections:', err);
    process.exit(1);
  }
};

export default cleanDB;
