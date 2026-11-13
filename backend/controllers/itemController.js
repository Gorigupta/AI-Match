import Item from "../models/Item.js";
import { scoreMatch } from "../utils/matching.js";

export async function createItem(req, res) {
  try {
    const { type, title, description, category, location, date, imageUrl } = req.body;
    if (!type || !title || !description || !category || !location || !date)
      return res.status(400).json({ message: "Please complete all required fields" });
    const item = await Item.create({ type, title, description, category, location, date, imageUrl: imageUrl || "", user: req.user._id });
    res.status(201).json({ item });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getItems(req, res) {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { location: { $regex: req.query.search, $options: "i" } }
    ];
    const items = await Item.find(filter).populate("user", "name email").sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function myItems(req, res) {
  const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
}

export async function getMatches(req, res) {
  try {
    const lostItems = await Item.find({ type: "lost", user: req.user._id, status: "open" });
    const foundItems = await Item.find({ type: "found", status: "open", user: { $ne: req.user._id } }).populate("user", "name");
    const matches = [];
    for (const lost of lostItems) {
      for (const found of foundItems) {
        const score = scoreMatch(lost, found);
        if (score >= 25) matches.push({ lost, found, score });
      }
    }
    matches.sort((a, b) => b.score - a.score);
    res.json({ matches });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function updateStatus(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not allowed" });
    item.status = req.body.status;
    await item.save();
    res.json({ item });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function deleteItem(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not allowed" });
    await item.deleteOne();
    res.json({ message: "Report deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function adminStats(req, res) {
  const [users, items, lost, found] = await Promise.all([
    (await import("../models/User.js")).default.countDocuments(),
    Item.countDocuments(), Item.countDocuments({ type: "lost" }), Item.countDocuments({ type: "found" })
  ]);
  res.json({ users, items, lost, found });
}