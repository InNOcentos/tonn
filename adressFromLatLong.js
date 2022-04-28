const axios = require("axios");

async function getAddr({ lat, long }) {
  let url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
  let token = "6e9d4fe629b2fd1711f791cac958dc6bf3cfb210";
  let query = {
    lat,
    lon: long,
    count: 1,
    /*     radius_meters: 20, */
  };
  let options = {
    method: "POST",
    url,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    data: query,
  };

  const { data } = await axios(options).catch((err) => console.log(err));
  let sugg = data.suggestions[0];
  if (!sugg) return "";

  // область
  if (sugg.value.match(" обл,")) {
    return sugg.value.split(",")[1].substring(1).split(" ")[1];
  }

  return (
    data.suggestions[0].value.split(",")[1].replace(" ул ", "Улица ") +
    ` (${data.suggestions[0].value.split(",")[0].split(" ")[1]})`
  );
}

/* getAddr({ lat: 55.862262, lon: 37.421341 }).then((d) => console.log(d)); */
module.exports = getAddr;
