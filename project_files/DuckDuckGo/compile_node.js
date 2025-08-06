const { title, snippet, url } = items[0].json;

// Exclude first two entries (ads)
const startIdx = 2;

let compiled = "";
for (let i = startIdx; i < title.length; i++) {
  compiled += `${i - startIdx + 1}. ${title[i]}\n${snippet[i]}\n${url[i]}\n\n`;
}

return [
  {
    json: {
      compiledResults: compiled.trim(),
    },
  },
];
