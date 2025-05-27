const asyncHandler = require("express-async-handler");

const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("user params not sent with request");
    res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,

    // this is happening because $elementMatch is meant for arrays of subdocuments, not for simple arrays like
    // so error occurs
    // $and: [
    //     {users:{$elementMatch:{$eq:req.user._id}}},
    //     {users:{$elementMatch:{$eq:userId}}},
    // ],
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isgroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// const fetchChats= asyncHandler (async(req, res)=>{
//     try {

//         Chat.find({users:{$elementMatch:{$eq:req.user._id}}}).then(result=>res.send(result));

//     } catch (error) {

//     }

// });

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: "Please fill all ther details" });
    // throw new Error("Please fill all the fields");
  }
  //userd below line to convert string to array
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    res
      .status(400)
      .send({ message: "Minimun 2 users are required to create a group chat" });
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      // chatName:chatName,if key and valye paise name is same we can write it as chatName
      chatName,
    },
    {
      new: true, // to update the value
    }
  )

    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )

    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )

    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
