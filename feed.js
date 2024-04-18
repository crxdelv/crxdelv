const rss = {
  write(content) {
    const title = "cre's feed"
    const desc = "cre's github updates (@creuserr)"
    const prefix = `<?xml version="1.0" encoding="UTF-8" ?><rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0"><channel><title><![CDATA[ ${title} ]]></title><link>https://github.com/creuserr</link><description><![CDATA[ ${desc} ]]></description>`
    const suffix = `</channel></rss>`
    return prefix + content + suffix
  },
  item({ title, link, desc, date, img, stars }) {
    const thumb = img == null ? "" : `<media:content url="${img}" medium="image"></media:content><media:thumbnail url="${img}"></media:thumbnail>`
    const categ = category == null ? "" : `<category>${stars} stars</category>`
    return `<item><title><![CDATA[ ${title} ]]></title><link>${link}</link><description><![CDATA[ ${desc} ]]></description><pubDate>${date}</pubDate>${thumb}</item>`
  }
}

const git = {
  async repo() {
    const req = await fetch("https://creprox.vercel.app/https:/api.github.com/users/creuserr/repos")
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
    const req = await fetch("https://creprox.vercel.app/https:/api.github.com/users/creuserr/gists")
    const raw = await req.json()
    return raw.map(gist => {
      return {
        link: gist.url,
        title: Object.keys(gist.files).join(" \u2022 "),
        date: gist.updated_at,
        desc: "@creuserr posted a new gist" + (gist.description == null ? "" : " | " + gist.description)
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  async all() {
    const repo = await this.repo()
    const gist = await this.gist()
    return repo.concat(gist).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/xml")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.statusCode = 200
  try {
    const f = await git.all()
    res.end(rss.write(f.map(x => rss.item(x)).join("")))
  } catch(e) {
    res.end(rss.write(rss.item({
      date: new Date().toString(),
      title: "500 Internal Error",
      desc: `Failed to generate | ${e}`,
      link: "https://github.com/creuserr"
    })))
  }
}