const { registerUser, loginUser, getUserProfile } = require("../Services/authService");



exports.registerUser = async (req, res) => {
  try {
    const response = await registerUser(req.body);
    res.status(201).json(response)
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}

exports.loginUser = async (req, res) => {
  try {
    const response = await loginUser(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error:error.message})
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const response =  await getUserProfile(req.user.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({error:error.message});
  }
};