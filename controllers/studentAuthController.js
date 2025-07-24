const axios = require("axios");
const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");

exports.loginWithUniversity = async (req, res) => {
  const { admissionNo, password } = req.body;

  try {
    // Call university login API
    const uniRes = await axios.post("https://university.edu/api/login", {
      admissionNo,
      password,
    });

    const { success, student, token: uniToken } = uniRes.data;

    if (!success) {
      return res.status(401).json({ error: "Invalid university credentials" });
    }

    // Check if student exists locally
    let localStudent = await Student.findOne({ admissionNo });

    // Auto-create if not found
    if (!localStudent) {
      localStudent = await Student.create({
        admissionNo,
        fullName: student.name,
        email: student.email,
        program: student.program,
        year: student.year,
      });
    }

    // Issue local app token (optional)
    const appToken = generateToken(localStudent._id);

    res.status(200).json({
      message: "Login successful",
      student: localStudent,
      token: appToken,
      universityToken: uniToken, // Optional
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "University login failed" });
  }
};
const universityAuth = await axios.post("https://university.edu/api/login", {
  admissionNo,
  password,
});

if (universityAuth.data.success) {
  // Check if student already exists locally
  let student = await Student.findOne({ admissionNo });

  // Auto-register locally if not
  if (!student) {
    const studentDetails = await axios.get(
      `https://university.edu/api/student/${admissionNo}`
    );
    student = await Student.create({
      admissionNo,
      fullName: studentDetails.data.name,
      email: studentDetails.data.email,
      department: studentDetails.data.department,
      // other info if needed
    });
  }

  // Proceed with session/token
  const token = generateToken(student._id);
  res.json({ token, student });
} else {
  res.status(401).json({ error: "Invalid credentials" });
}

    