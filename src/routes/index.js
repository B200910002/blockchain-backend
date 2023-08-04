const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, code: "F.CS306", name: "Параллель программчлал" },
  { id: 2, code: "F.CS303", name: "Хиймэл оюуны үндэс" },
  { id: 3, code: "F.IT301", name: "Веб систем ба технологи" },
  { id: 2, code: "F.CS314", name: "Программ хангамжийн зохиомж ба архитектур" },
];

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send("Hello!!!");
});

router.get("/api/courses", (req, res, next) => {
  res.send(courses);
});

router.get("/api/courseById/:id", (req, res, next) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("not found!");
  res.send(course);
});

router.get("/api/courseByCode/:code", (req, res, next) => {
  const course = courses.find((element) => element.code === req.params.code);
  if (!course) res.status(404).send("not found!");
  res.send(course);
});

module.exports = router;
