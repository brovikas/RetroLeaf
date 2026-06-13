import Entry from "../models/Entry.js";
import User from "../models/User.js";

const updateStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = user.streak.lastEntryDate ? new Date(user.streak.lastEntryDate) : null;
  if (lastDate) lastDate.setHours(0, 0, 0, 0);

  if (!lastDate) {
    user.streak.current = 1;
  } else {
    const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return;
    } else if (diffDays === 1) {
      user.streak.current += 1;
    } else {
      user.streak.current = 1;
    }
  }

  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current;
  }

  user.streak.lastEntryDate = today;
  await user.save();
};

// @desc    Create a new journal entry
// @route   POST /api/entries
// @access  Private
export const createEntry = async (req, res, next) => {
  try {
    const { title, content, mood, tags, isPrivate, weather } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const entry = await Entry.create({
      user: req.user._id,
      title,
      content,
      mood,
      tags: tags || [],
      isPrivate,
      weather,
    });

    await updateStreak(req.user);

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all entries for logged in user (with search, filter, pagination)
// @route   GET /api/entries
// @access  Private
export const getEntries = async (req, res, next) => {
  try {
    const { search, mood, tag, favorite, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$text = { $search: search };
    }

    if (mood) query.mood = mood;
    if (tag) query.tags = tag;
    if (favorite === "true") query.isFavorite = true;

    const skip = (Number(page) - 1) * Number(limit);

    const entries = await Entry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Entry.countDocuments(query);

    res.status(200).json({
      entries,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single entry by ID
// @route   GET /api/entries/:id
// @access  Private
export const getEntryById = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this entry" });
    }

    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an entry
// @route   PUT /api/entries/:id
// @access  Private
export const updateEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this entry" });
    }

    const { title, content, mood, tags, isFavorite, isPrivate, weather } = req.body;

    entry.title = title ?? entry.title;
    entry.content = content ?? entry.content;
    entry.mood = mood ?? entry.mood;
    entry.tags = tags ?? entry.tags;
    entry.isFavorite = isFavorite ?? entry.isFavorite;
    entry.isPrivate = isPrivate ?? entry.isPrivate;
    entry.weather = weather ?? entry.weather;

    const updatedEntry = await entry.save();
    res.status(200).json(updatedEntry);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an entry
// @route   DELETE /api/entries/:id
// @access  Private
export const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this entry" });
    }

    await entry.deleteOne();
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get journal statistics (mood breakdown, totals, streak) - dashboard feature
// @route   GET /api/entries/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalEntries = await Entry.countDocuments({ user: userId });
    const favoriteCount = await Entry.countDocuments({ user: userId, isFavorite: true });

    const moodBreakdown = await Entry.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
    ]);

    const user = await User.findById(userId);

    res.status(200).json({
      totalEntries,
      favoriteCount,
      moodBreakdown,
      streak: user.streak,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a random past entry ("On This Day" / memory lane feature)
// @route   GET /api/entries/random
// @access  Private
export const getRandomEntry = async (req, res, next) => {
  try {
    const count = await Entry.countDocuments({ user: req.user._id });

    if (count === 0) {
      return res.status(404).json({ message: "No entries found yet" });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const entry = await Entry.findOne({ user: req.user._id }).skip(randomIndex);

    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};
