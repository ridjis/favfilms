const helper = require("./helper.controller");

module.exports = {
  index: async (_, res) => {
    res.render("pages/adv-cards", {
      header: "Most favorited movies",
      results: await helper.movies()
    });
  }
};
