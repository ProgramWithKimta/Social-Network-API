export const users = [
    {username: 'john',
      email: 'user1@live.com' },
    {username: 'jane',
       email: 'user2@live.com' },
    {username: 'doe',
       email: 'user3@live.com' },
  ];
  
  export const thoughts = [
    {
      thoughtText: 'What a great day to learn something new!',
      username: 'john',
      reactions: [
        {
          reactionBody: 'I agree!',
          username: 'jane',
        },
        {
          reactionBody: 'Learning is fun!',
          username: 'doe',
        },
      ],
    },
    {
      thoughtText: 'TypeScript is awesome!',
      username: 'jane',
      reactions: [
        {
          reactionBody: 'Totally!',
          username: 'john',
          
        },
      ],
    },
    {
      thoughtText: 'MongoDB is a great database!',
      username: 'doe',
      reactions: [
        {
          reactionBody: 'Absolutely!',
          username: 'john',
        },
        {
          reactionBody: 'I prefer SQL though.',
          username: 'jane',
        },
      ],
    },
  ];
  
  // Simple friend mapping (usernames)
  export const friendsMap: Record<string, string[]> = {
    john: ['jane', 'doe'],
    jane: ['john'],
    doe: ['john'],
  };
  