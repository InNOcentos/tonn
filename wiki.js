var wikipediaParser = require("./wikipedia-to-json/WikipediaParser");

function getParsed(arr) {
  return arr.reduce(
    (acc, e) => {
      if (e?.type == "PARAGRAPH") {
        acc.text.push(e?.text);
      }
      if (e?.type == "IMAGE") {
        acc.images.push({
          title: e?.caption,
          url: e?.url,
        });
      }
      return acc;
    },
    {
      text: [],
      images: [],
    }
  );
}

async function run(location) {
  try {
    console.log(123);
    const data = await wikipediaParser.fetchArticleElements(location);

    console.log(data);

    let historyStartIdx,
      historyEndIdx,
      introStartIdx,
      introEndIdx,
      EconomicStartIdx,
      EconomicEndIdx;
    let opt = 0;

    data.forEach((e, idx) => {
      if (e.text == "История") {
        historyStartIdx = idx;
      }
      if (e.text == "Экономика") {
        EconomicStartIdx = idx;
      }
      if (
        e.type == "TITLE" &&
        historyStartIdx &&
        !historyEndIdx &&
        e.text !== "История"
      ) {
        historyEndIdx = idx;
      }
      if (
        e.type == "TITLE" &&
        EconomicStartIdx &&
        !EconomicEndIdx &&
        e.text !== "Экономика"
      ) {
        EconomicEndIdx = idx;
      }
      if (introStartIdx && !opt) {
        if (e.type == "TITLE") {
          introEndIdx = idx;
          opt = 1;
        }
      }
      if (e.text == "Introduction") {
        introStartIdx = idx + 1;
      }
    });

    console.log(historyStartIdx);
    console.log(historyEndIdx);

    const histo = data.slice(historyStartIdx, historyEndIdx + 1);
    const int = data.slice(introStartIdx, introEndIdx);
    const eco = data.slice(EconomicStartIdx, EconomicEndIdx + 1);

    const history = getParsed(histo);
    const intro = getParsed(int);
    const economics = getParsed(eco);

    console.log(history);
    return {
      history,
      intro,
      economics,
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = run;
