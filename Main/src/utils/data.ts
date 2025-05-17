export const users = [
    {username: 'panda',
      email: 'panda@gmail.com' },
    {username: 'kimta',
       email: 'kimta@gmail.com' },
    {username: 'kuma',
       email: 'kuma@gmail.com' },
  ];
  
  export const thoughts = [
    {
      thoughtText: 'I love Pandas',
      username: 'kimta',
      reactions: [
        {
          reactionBody: 'sure thing!',
          username: 'kuma',
        },
      ],
    },
    {
      thoughtText: 'i want a treat',
      username: 'kuma',
      reactions: [
        {
          reactionBody: 'i could go for one too',
          username: 'panda',
          
        },
      ],
    },
    {
      thoughtText: 'im hungry for bamboo',
      username: 'panda',
      reactions: [
        {
          reactionBody: 'that sounds gross',
          username: 'kuma',
        },
        {
          reactionBody: 'I like bamboo sticks.',
          username: 'kimta',
        },
      ],
    },
  ];
  
  // Simple friend mapping (usernames)
  export const friendsMap: Record<string, string[]> = {
    kimta: ['Kuma'],
    kuma: ['kimta', 'panda'],
    Panda: ['kimta'],
  };
  