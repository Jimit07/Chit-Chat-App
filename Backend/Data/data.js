const chats = [
    {
      isGroupChat: false,
      users: [
        {
          isGroupChat: false,
          users: [
            {
              name: "Ekta pandya",
              email: "ekta@gmail.com",
            },
            {
              name: "John Doe",
              email: "john@example.com",
            },
           
          ],
          _id: "67d81f7fc8fd13c0ca403af1",
          chatName: "Ekta pandya",
        },
        {
          name: "John Doe",
          email: "john@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
      ],
      _id: "617a077e18c25468bc7c4dd4",
      chatName: "John Doe",
    },
    {
      isGroupChat: false,
      users: [
        {
          name: "Guest User",
          email: "guest@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
      ],
      _id: "617a077e18c25468b27c4dd4",
      chatName: "Guest User",
    },
    {
      isGroupChat: false,
      users: [
        {
          name: "Anthony",
          email: "anthony@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
      ],
      _id: "617a077e18c2d468bc7c4dd4",
      chatName: "Anthony",
    },
    {
      isGroupChat: true,
      users: [
        {
          name: "John Doe",
          email: "jon@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
        {
          name: "Guest User",
          email: "guest@example.com",
        },
      ],
      _id: "617a518c4081150716472c78",
      chatName: "Friends",
      groupAdmin: {
        name: "Guest User",
        email: "guest@example.com",
      },
    },
    {
      isGroupChat: false,
      users: [
        {
          name: "Jane Doe",
          email: "jane@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
      ],
      _id: "617a077e18c25468bc7cfdd4",
      chatName: "Jane Doe",
    },
    {
      isGroupChat: true,
      users: [
        {
          name: "John Doe",
          email: "jon@example.com",
        },
        {
          name: "Piyush",
          email: "piyush@example.com",
        },
        {
          name: "Guest User",
          email: "guest@example.com",
        },
      ],
      _id: "617a518c4081150016472c78",
      chatName: "Chill Zone",
      groupAdmin: {
        name: "Guest User",
        email: "guest@example.com",
      },
    },
  ];

  export default chats ;






  // "_id": "67e906049cd5806c76440363",
  //   "name": "Piyush Agarwal",
  //   "email": "piyush@example.com",
  //   "pic": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  //   "tokens": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkwNjA0OWNkNTgwNmM3NjQ0MDM2MyIsImlhdCI6MTc0MzMyNDY3NywiZXhwIjoxNzQ1OTE2Njc3fQ.N-VWgQgTqMXXiuggTOr36whslbrlcwqdkNwAD2TTHr0"