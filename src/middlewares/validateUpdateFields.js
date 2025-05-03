function validateUserUpdateFields(allowedUpdates) {
  return (req, res, next) => {
    const userBody = req.body;
    const updateKeys = Object.keys(userBody);
    const userSkills = userBody.skills;
    const uniqueSkills = {};
    for (const skill of userSkills) {
      if (uniqueSkills[skill]) {
        return res.status(400).send("User cannot have duplicate skills");
      }
      uniqueSkills[skill] = true;
    }
    for (let i = 0; i < updateKeys.length; i++) {
      if (!allowedUpdates.includes(updateKeys[i])) {
        return res
          .status(400)
          .send(`Update not allowed on field ${updateKeys[i]}`);
      }
    }
    next();
  };
}
module.exports = validateUserUpdateFields;
