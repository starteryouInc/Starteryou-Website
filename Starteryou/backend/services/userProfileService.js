const UserProfile = require("../models/UserProfile");

const addSubdocument = async (userId, field, data, res) => {
  try {
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    user[field].push(data);
    await user.save();
    res.status(201).json({
      success: true,
      dataLength: user[field].length,
      msg: `${field} added successfully`,
      data: user[field],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Some error occured while adding the ${field}`,
      error,
    });
  }
};

const updateSubdocument = async (userId, subDocId, field, updates, res) => {
  try {
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    const subDoc = user[field].id(subDocId);
    if (!subDoc) {
      return res.status(404).json({ msg: "Sub Document not found!" });
    }
    Object.assign(subDoc, updates);
    await user.save();
    res.status(200).json({
      success: true,
      msg: `${field} updated successfully`,
      data: subDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Some error occured while updating the ${field}`,
      error,
    });
  }
};

const deleteSubdocument = async (userId, subDocId, field, res) => {
  try {
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    const subDoc = user[field].id(subDocId);
    if (!subDoc) {
      return res.status(404).json({ msg: "Sub Document not found!" });
    }

    subDoc.remove();
    await user.save();
    res.status(200).json({
      success: true,
      msg: `${field} deleted successfully`,
      data: subDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Some error occured while deleting the ${field}`,
      error,
    });
  }
};

const addStringToArray = async (userId, field, value, res) => {
  try {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        success: false,
        msg: `Invalid value for ${field}. Must be a non-empty string.`,
      });
    }

    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    user[field].push(value.trim());
    await user.save();

    res.status(201).json({
      success: true,
      dataLength: user[field].length,
      msg: `${field} item added successfully`,
      data: user[field],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Some error occurred while adding to ${field}`,
      error,
    });
  }
};

const deleteStringFromArray = async (userId, field, value, res) => {
  try {
    const user = await UserProfile.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const index = user[field].indexOf(value);
    if (index === -1) {
      return res
        .status(404)
        .json({ msg: `${value} not found in the ${field}` });
    }

    user[field].splice(index, 1);
    await user.save();

    res.status(200).json({
      success: true,
      msg: `${value} deleted successfully`,
      data: value,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Some error occured while deleting the ${value}`,
      error,
    });
  }
};

module.exports = {
  addSubdocument,
  updateSubdocument,
  deleteSubdocument,
  addStringToArray,
  deleteStringFromArray,
};
