const rss = {
  write(content, latency) {
    const title = "cre's feed"
    const desc = "cre's github updates (@creuserr)"
    const prefix = `<?xml version="1.0" encoding="UTF-8" ?>\n<!--\n  Dynamically generated with the latency of ${latency}ms\n  Raw file at: https://github.com/creuserr/creuserr/blob/main/api/feed.js\n-->\n<rss><channel><title><![CDATA[ ${title} ]]></title><link>https://github.com/creuserr</link><description><![CDATA[ ${desc} ]]></description>`
    const suffix = `</channel></rss>`
    return prefix + content + suffix
  },
  item({ title, link, desc, date, img, stars }) {
    const thumb = img == null ? "" : `<enclosure url="${img}" length="0" type="image/png" />`
    let categ = stars == null || stars < 2 ? "" : `<category>${stars} &#9733;</category>`
    const pubdate = date == null ? "" : `<pubDate>${date}</pubDate>`
    return `<item><title><![CDATA[ ${title} ]]></title><link>${link}</link><description><![CDATA[ ${desc} ]]></description>${pubdate + thumb + categ}</item>`
  }
}

const git = {
  async repo() {
    const req = await fetch("https://api.github.com/users/creuserr/repos")
    const raw = await req.json()
    return raw.map(repo => {
      return {
        link: repo.html_url,
        title: repo.full_name,
        date: repo.updated_at,
        desc: "@creuserr created a new repository" + (repo.description == null ? "" : " | " + repo.description),
        img: `https://og-theta.vercel.app/api/general?siteName=${encodeURIComponent(repo.full_name)}&amp;description=${encodeURIComponent(repo.description || "@creuserr created a new repository")}&amp;theme=dark&amp;logo=https://crebin.vercel.app/static/avatar.png&amp;logoWidth=120`,
        stars: repo.stargazers_count
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  async gist() {
    const req = await fetch("https://api.github.com/users/creuserr/gists")
    const raw = await req.json()
    return raw.map(gist => {
      return {
        link: gist.html_url,
        title: Object.keys(gist.files).join(" \u2022 "),
        date: gist.updated_at,
        desc: "@creuserr posted a new gist" + (gist.description == null ? "" : " | " + gist.description)
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  async all() {
    const repo = await this.repo()
    const gist = await this.gist()
    let populated = repo.concat(gist).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    populated.unshift({
      link: "https://github.com/creuserr",
      title: "@creuserr",
      desc: "15 | my projects about programming",
      img: "https://avatars.githubusercontent.com/u/151720755?v=4"
    })
    return populated
  }
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/xml")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.statusCode = 200
  try {
    const latency = performance.now()
    const f = await git.all()
    res.end(rss.write(f.map(x => rss.item(x)).join(""), performance.now() - latency))
  } catch(e) {
    res.end(rss.write(rss.item({
      date: new Date().toString(),
      title: "500 Internal Error",
      desc: `Failed to generate | ${e}`,
      link: "https://github.com/creuserr"
    })))
  }
}
