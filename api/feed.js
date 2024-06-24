const rss = {
  write(content) {
    const title = "cre's feed";
    const desc = "cre's github updates (@creuserr)";
    const prefix = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss><channel><title><![CDATA[ ${title} ]]></title><link>https://github.com/creuserr</link><description><![CDATA[ ${desc} ]]></description>`;
    const suffix = `</channel></rss>`;
    return prefix + content + suffix;
  },
  item(data) {
    const img = data.img ? `<enclosure url="${data.img}" length="0" type="image/png" />` : "";
    const badge = data.badge ? `<category>${data.badge}</category>` : "";
    const date = `<pubDate>${data.date}</pubDate>`;
    return `<item><title><![CDATA[ ${data.title} ]]></title><link>${data.link}</link><description><![CDATA[ ${data.desc} ]]></description>${date + img + badge}</item>`;
  }
}

const git = {
  async repo() {
    const req = await fetch("https://api.github.com/users/creuserr/repos");
    const raw = await req.json();
    return raw.map(repo => {
      return {
        link: repo.html_url,
        title: repo.full_name,
        date: repo.updated_at,
        desc: "@creuserr created a new repository" + (repo.description == null ? "" : " | " + repo.description),
        img: `https://og-theta.vercel.app/api/general?siteName=${encodeURIComponent(repo.full_name)}&amp;description=${encodeURIComponent(repo.description || "@creuserr created a new repository")}&amp;theme=dark&amp;logo=https://crebin.vercel.app/static/avatar.png&amp;logoWidth=120`,
        badge: repo.stargazers_count + " &#9733;",
        sorting: new Date(repo.updated_at).getTime()
      };
    }).sort((a, b) => a.sorting - b.sorting);
  },
  async retrieve() {
    let repo = await this.repo();
    repo.unshift({
      link: "https://github.com/creuserr",
      title: "@creuserr",
      desc: "15 | my projects about programming",
      img: "https://avatars.githubusercontent.com/u/151720755?v=4"
    });
    return repo;
  }
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.statusCode = 200;
  try {
    const f = await git.retrieve();
    const output = rss.write(f.map(x => rss.item(x)).join(""));
    res.end(output);
  } catch(e) {
    res.end(rss.write(rss.item({
      date: new Date().toString(),
      title: "500 Internal Error",
      desc: `Failed to generate | ${e}`,
      link: "https://github.com/creuserr"
    })));
  }
}