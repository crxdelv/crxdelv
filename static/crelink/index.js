module.exports = async function(req, res) {
  res.setHeader("Content-Type", "text/html");
  try {
    var links = await fetch()
  } catch(e) {
    res.status(400).send("Failed to connect");
  }
}