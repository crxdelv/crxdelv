module.exports = async (req, res) => {
  const req = await fetch("https://creprox.vercel.app/https:/api.github.com/users/creuserr/repos")
  const raw = await req.json()
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Location", `https://img.shields.io/static/v1?label=Repositories&message=${raw.length}&color=2ea44f&style=for-the-badge&logo=github`)
  res.statusCode = 301
  res.end()
}