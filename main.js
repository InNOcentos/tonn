const infobox = require("./infobox");
const addr = require("./adressFromLatLong");
const wiki = require("./wiki");

const express = require("express");

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { adress, coords } = req.body;

  const data = await main({ adress, coords });
  console.log(data);
  res.json(data);
});

app.listen(3000);

async function main({ adress, coords }) {
  if (!adress) {
    if (!coords) return {};
    const [lat, long] = coords.split(",");
    adress = await addr({ lat, long });
  }

  const box = await infobox(adress);

  if (!box) return {};

  const wik = await wiki(adress);

  return {
    infobox: box,
    adress: adress,
    main: wik,
  };
}
