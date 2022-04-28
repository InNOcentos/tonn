const wiki = require("./wiki-infobox-table");

async function getInfoBox(st) {
  const data = await wiki({
    url: "https://ru.wikipedia.org/wiki/" + encodeURI(st),
  });

  if (!data) return null;

  return Object.values(data).reduce((acc, el) => {
    const { key, value } = el;
    if (key == "Страна") {
      acc["country"] = value;
    }
    if (key == "Город") {
      acc["city"] = value;
    }
    if (key == "Основан") {
      acc["founded"] = value;
    }
    if (key == "Округ") {
      acc["region"] = value;
    }
    if (key == "Прежние названия") {
      acc["prev_names"]
        ? acc["prev_names"].push(value)
        : (acc["prev_names"] = [...value]);
    }
    if (key == "Район") {
      acc["district"] = value;
    }
    if (key == "Ближайшие станции метро") {
      acc["closest_metro"] = value;
    }
    if (key == "Ссылка") {
      acc.links ? acc.links.push(...value) : (acc.links = [...value]);
    }
    if (key == "Включение") {
      acc["inclusion"] = value;
    }
    return acc;
  }, {});
}

/* getInfoBox().then((data) => console.log(data)); */
module.exports = getInfoBox;
