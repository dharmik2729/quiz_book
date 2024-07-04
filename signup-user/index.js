const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const cloudinary = require('./config/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { User,Gender, Standard, Subject, Chapter, Question, Result, UserAnswer, Profession } = require('./models');
const { Sequelize, DataTypes, Model } = require('sequelize');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/users/signup', upload.single('userProfile'), async (req, res) => {
  try {
    const { firstName, lastName, email, genderID, DOB, mobileNumber, professionId } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);

    const formattedDOB = moment(DOB, 'DD/MM/YYYY');
    if (!formattedDOB.isValid()) {
      return res.status(400).json({ error: 'Invalid DOB format. Use DD/MM/YYYY.' });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      genderID,
      DOB: formattedDOB.format('DD/MM/YYYY'),
      mobileNumber,
      professionId,
      userProfile: result.secure_url
    });

   const gender = await Gender.findByPk(genderID);
   const profession = await Profession.findByPk(professionId);

    res.status(201).json({
     user,
     genderDescription: gender ? gender.name : 'Unknown',
     professionDescription: profession ? profession.name : 'Unknown'
   });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/users/gender', async (req, res) => {
  try {
    const genders = await Gender.findAll();
    res.json(genders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }   
});


app.post('/users/verify', async (req, res) => {
    try {
      const { mobileNumber } = req.body;
  
      const user = await User.findOne({ where: { mobileNumber } });
  
      if (user) {
        res.status(200).json({ message: 'User verified', user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/users/login', async (req, res) => {
  const { mobileNumber } = req.body;

  try {

      const user = await User.findOne({ where: { mobileNumber } });

      if (!user) {
          return res.status(401).json({ error: 'Invalid mobile number' });
      }

      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
      
      res.status(200).json({ message: 'Successfully logged in', token });
  } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

const tokenBlacklist = [];

const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized: Token has been logged out' });
  }
  next();
};



const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.userId; 
    next();
  });
};

app.get('/users/profile', checkTokenBlacklist,  verifyToken, async (req, res) => {
  try {

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/profile/update', verifyToken, async (req, res) => {
  const { firstName, lastName, DOB, email, genderID, professionId, userProfile } = req.body;

  try {

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.DOB = DOB || user.DOB;
    user.email = email || user.email;
    user.genderID = genderID || user.genderID;
    user.professionId = professionId || user.professionId;
    user.userProfile = userProfile || user.userProfile;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/addstd', verifyToken, async (req, res) => {
  const { std } = req.body;

  try {
       if (!std) {
      return res.status(400).json({ error: 'Standard (std) is required' });
    }

       const newStandard = await Standard.create({ std });

    res.status(201).json({ message: 'Standard added successfully', standard: newStandard });
  } catch (error) {
    console.error('Error adding standard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


const storages = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'subjects', 
    format: async (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return ext;
    }
    return 'png';
  },   public_id: (req, file) => {
    const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
    return `${Date.now()}-${nameWithoutExt}`;
  }
}
});
   
const uploads = multer({ storage: storages });

app.post('/addsubjects', verifyToken, uploads.single('img'), async (req, res) => {
  try {
    const { stdid, subjectName } = req.body;
    
    const img = req.file ? req.file.path : null;

    const subject = await Subject.create({ stdid, subjectName, img });

    res.status(201).json(subject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ error: 'An error occurred while adding the subject.' });
  }
});

app.get('/std',  async (req, res) => {
  try {
    const standards = await Standard.findAll({
      include: { model: Subject, as: 'subjects' }
    });
    res.json({ standards });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/addchapters', verifyToken, async (req, res) => {
  const { chapterid, stdid, subid, chapterno, content, teacher, que, minute } = req.body;
 
  try {
    const newChapter = await Chapter.create({
      chapterid,  
      stdid,
      subid,
      chapterno,
      content,
      teacher,
      que,
      minute
    });

    return res.status(201).json({ message: 'Chapter added successfully', chapter: newChapter });
  } 
  catch (error) {
    console.error('Error adding chapter:', error);
    res.status(500).json({ error: 'Failed to add chapter'});
  }
});


app.post('/standard/:stdId/subject/:subId/chapters', async (req, res) => {
  try {
    const { stdId, subId } = req.body;

    const standard = await Standard.findOne({
      where: { id: stdId },
      include: [
        {
          model: Subject,
          as: 'subjects',
          where: { id: subId },
          include: [
            {
              model: Chapter,
              as: 'chapters'
            }
          ]
        }
      ]
    });

    if (standard) {
      res.json(standard);
    } else {
      res.status(404).json({ error: 'No chapters found for the given standard and subject.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/std/subject/chapter/addquestions', verifyToken, async (req, res) => {
  const { stdid, subid, chapterid, question_no, question, Option, rightAns } = req.body;

  try {
    const newQuestion = await Question.create({
      stdid,
      subid,
      chapterid,
      question_no,
      question,
      Option,
      rightAns
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/std/subject/chapter/questions', async (req, res) => {
  const { stdid, subid, chapterid } = req.body;

  try {
      const questions = await Question.findAll({
          where: {
              stdid,
              subid,
              chapterid
          }
      });
      res.json(questions);
  } catch (error) {
      res.status(500).send('Error retrieving questions: ' + error.message);
  }
});



app.post('/results', verifyToken, async (req, res) => {
  const { stdid, subid, chapterid, questions } = req.body;
  const userId = req.userId;

  try {
      const result = await Result.create({
          stdid,
          subid,
          chapterid,
          userId
      });

      const userAnswers = questions.map(q => ({
          resultId: result.id,
          queid: q.queid,
          user_answer: q.user_answer
      }));

      await UserAnswer.bulkCreate(userAnswers);

      res.status(201).json({ message: 'Results submitted successfully' });
  } catch (error) {
      res.status(500).send('Error saving results: ' + error.message);
  }
})

app.get('/results', verifyToken, async (req, res) => {
  try {
    const userId = req.userId 
    const results = await Result.findAll({
      where: { userId }, 
      include: {
        model: UserAnswer,
        as: 'userAnswers',
      },
    });
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users/profession', async (req, res) => {
  try {
    const professions = await Profession.findAll();
    res.json({ professions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/history', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Result,
        as: 'results',
        include: {
          model: UserAnswer,
          as: 'userAnswers'
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/users/delete', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      include: {
        model: Result,
        as: 'results',
        include: {
          model: UserAnswer,
          as: 'userAnswers'
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete associated userAnswers and results
    for (const result of user.results) {
      await UserAnswer.destroy({ where: { resultId: result.id } });
    }
    await Result.destroy({ where: { userId: userId } });

    // Now delete the user
    await user.destroy();

    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/user/logout', checkTokenBlacklist, (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header

    // Add token to blacklist
    tokenBlacklist.push(token);

    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
