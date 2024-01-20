module.exports = async function(req, res) {
  res.setHeader("Content-Type", "text/html");
  try {
    var links = await fetch("https://crestatic.vercel.app/creuserr/creuserr/static/crelink/data.json");
    links = await links.json();
    var meta = `<meta http-equiv="refresh" content="0; URL=${links[]}">`;
    res.status(200).send("Redirecting..." + meta);
  } catch(e) {
    res.status(400).send("Failed to connect.");
  }
}