const UserProfile = require("../models/UserProfile");

/**
 * Adds a subdocument to a specified field in a user's profile.
 *
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} field - The field to which the subdocument should be added.
 * @param {Object} data - The subdocument data to be added.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} - Sends a response indicating success or failure.
 */
const addSubdocument = async (userRegistrationId, field, data, res) => {
  try {
    const user = await UserProfile.findOne({ userRegistrationId });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    // Ensure the field is initialized as an array
    if (!Array.isArray(user[field])) {
      user[field] = [];
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
      msg: `Some error occurred while adding the ${field}`,
      error,
    });
  }
};

/**
 * Updates a subdocument in a specified field of a user's profile.
 *
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} subDocId - The ID of the subdocument to update.
 * @param {string} field - The field containing the subdocument.
 * @param {Object} updates - The updates to apply to the subdocument.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} - Sends a response indicating success or failure.
 */
const updateSubdocument = async (userRegistrationId, subDocId, field, updates, res) => {
  try {
    const user = await UserProfile.findOne({ userRegistrationId });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const subDoc = user[field].id(subDocId);
    if (!subDoc) {
      return res.status(404).json({ msg: "Subdocument not found!" });
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
      msg: `Some error occurred while updating the ${field}`,
      error,
    });
  }
};

/**
 * Deletes a subdocument from a specified field in a user's profile.
 *
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} subDocId - The ID of the subdocument to delete.
 * @param {string} field - The field containing the subdocument.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} - Sends a response indicating success or failure.
 */
const deleteSubdocument = async (userRegistrationId, subDocId, field, res) => {
  try {
    const user = await UserProfile.findOne({ userRegistrationId });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const subDoc = user[field].id(subDocId);
    if (!subDoc) {
      return res.status(404).json({ msg: "Subdocument not found!" });
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
      msg: `Some error occurred while deleting the ${field}`,
      error,
    });
  }
};

/**
 * Adds a string to an array field in a user's profile.
 *
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} field - The array field to add the string to.
 * @param {string} value - The string value to add.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} - Sends a response indicating success or failure.
 */
const addStringToArray = async (userRegistrationId, field, value, res) => {
  try {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        success: false,
        msg: `Invalid value for ${field}. Must be a non-empty string.`,
      });
    }

    const user = await UserProfile.findOne({ userRegistrationId });
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

/**
 * Deletes a string from an array field in a user's profile.
 *
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} field - The array field to remove the string from.
 * @param {string} value - The string value to remove.
 * @param {import("express").Response} res - The response object.
 * @returns {Promise<void>} - Sends a response indicating success or failure.
 */
const deleteStringFromArray = async (userRegistrationId, field, value, res) => {
  try {
    const user = await UserProfile.findOne({ userRegistrationId });
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const index = user[field].indexOf(value);
    if (index === -1) {
      return res.status(404).json({ msg: `${value} not found in the ${field}` });
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
      msg: `Some error occurred while deleting the ${value}`,
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

