const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "fr",
    locales: ["en", "de", "fr"],
  },
  localePath: path.resolve("./public/locales"),
};
