const express = require("express");
const router = express.Router();

const { Day, Chef } = require("../models/day");
const allChef = require("../data/allChef");

router.post("/", async function (req, res) {
  console.log("Request attempted");
  console.log(req.body);

  try {
    const dateTime = new Date(req.body.date);

    let day = await Day.findOne({
      where: { date: dateTime },
      include: [Chef]
    });

    if (day) {
      console.log("Record exists. Sent docs.");
      return res.status(200).send(day);
    }

    day = await Day.create(
      {
        date: dateTime,
        Chefs: allChef
      },
      {
        include: [Chef] 
      }
    );

    console.log("Created new datetime. Here are the default docs");

    const newDay = await Day.findOne({
      where: { date: dateTime },
      include: [Chef]
    });

    return res.status(200).send(newDay);

  } catch (err) {
    console.error("Erro ao processar requisição:", err);
    return res.status(400).send("Erro ao processar a data");
  }
});

module.exports = router;
