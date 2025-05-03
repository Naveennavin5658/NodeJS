function validateUserUpdateFields(allowedUpdates) {
  return (req, res, next) => {
    const userBody = req.body;
    const updateKeys = Object.keys(userBody);
    const skills = userBody.skills;
    const uniqueSkills = new Set(skills);
    if(skills.length!=uniqueSkills.length){
        return res.status(400).send("User cannot have duplicate skills");
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
