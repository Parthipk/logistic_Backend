const Hub = require("../../model/hub");
const { errorResponse, successResponse } = require("../../helper/response");


exports.createHub = async (req, res, next) => {
  try {

    const { name, code, createdBy } = req.body;

    const existingHub = await Hub.findOne({ code: code.toUpperCase() });

    if (existingHub) {
      return res.status(404).json({ message: "HUB Code Already Exist" });
    }

    const hub = await Hub.create({
      name,
      code,
      createdBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      result: hub,
    });
  } catch (err) {
    next(err);
  }
};
