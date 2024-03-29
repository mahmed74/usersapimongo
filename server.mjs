import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("short"));
mongoose.set("strictQuery", false);

mongoose.connect(
  `mongodb+srv://mahmed74:ahmed0704@cluster0.f2dooat.mongodb.net/?retryWrites=true&w=majority`
);

const User = mongoose.model("User", {
  name: String,
  email: String,
  address: String,
});

app.use((req, res, next) => {
  console.log("a request came", req.body);
  next();
});

app.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (!err) {
      res.send(users);
    } else {
      res.status(500).send("error happened");
    }
  });
});
app.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (!err) {
      res.send(user);
    } else {
      res.status(500).send("error happened");
    }
  });
});
app.post("/user", (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.address) {
    res.status(400).send("invalid data");
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    });
    newUser.save().then(() => {
      console.log("user created success");
      res.send("users created");
    });
  }
});
app.put("/user/:id", (req, res) => {
  let updateObj = {};

  if (req.body.name) {
    updateObj.name = req.body.name;
  }
  if (req.body.email) {
    updateObj.email = req.body.email;
  }
  if (req.body.address) {
    updateObj.address = req.body.address;
  }

  User.findByIdAndUpdate(
    req.params.id,
    updateObj,
    { new: true },
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.status(500).send("error happened");
      }
    }
  );
});
app.delete("/user/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) {
      res.send("user deleted");
    } else {
      res.status(500).send("error happened");
    }
  });
});

app.get("/home", (req, res) => {
  res.send("here is your home");
});
app.get("/", (req, res) => {
  res.send("Hi I am a hello world Server program");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
