const data = require("./test.json");
export default function handler(req, res) {
  res.status(200).json(data);
}
