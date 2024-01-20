<!-- {
  "title": "How to build your own github cdn",
  "id": "how-to-build-your-own-github-cdn",
  "date": "Jan 19, 2023",
  "topics": ["NodeJS"]
} -->

Once upon a time, I developed a lightweight library. After completing it, I published the code on GitHub and utilized its path on jsDelivr's CDN. Despite consistently encountering bugs and discovering additional features over time, updating the file proved challenging due to the CDN retaining a 7-day caching period.

This dilemma prompted me to consider creating my own GitHub CDN. Eventually, I successfully established my [GitHub CDN](https://crestatic.vercel.app/octocat/hello-worId/README.md) with just two files. In this blog, I'll guide you through the creation process using Vercel, GitHub, and NodeJS.

To start, create three essential files: `index.js` and `vercel.json`.

## index.js

```javascript
module.exports = async function(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/plain");
  var user = null;
  var repo = null;
  var path = "";
  request.url.split("/").forEach(function(i) {
    if(i.trim().length == 0) return;
    if(user == null) user = i;
    else if(repo == null) repo = i;
    else path += `/${i}`;
  });
  if(path.startsWith("/")) path = path.slice(1);
  if(user == null || repo == null || path.length == 0) return response.status(400).send("Error: Incomplete parameter");
  var url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  try {
    var req = await fetch(url);
    var json = await req.json();
    if(json.content == null) {
      return response.status(400).send("Error: Not found");
    }
    var content = json.content.toString();
    return response.status(200).send(unescape(atob(content.replace(/\n/g, ""))));
  } catch(e) {
    return response.status(400).send(`Error: ${e}`);
  }
}
```

This code is separated into four parts, with the first setting headers for access control and content type.

The second part extracts the username, repository name, and file path from the request URL.

The third part validates the parameters, ensuring none are missing.

The final part fetches the GitHub file using the GitHub API and returns the content.

## vercel.json

```json
"headers": [{
  "source": "/index.js",
  "headers": [{
    "key": "Access-Control-Allow-Credentials",
    "value": "true"
  }, {
    "key": "Access-Control-Allow-Origin",
    "value": "*"
  }, {
    "key": "Access-Control-Allow-Methods",
    "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  }, {
    "key": "Access-Control-Allow-Headers",
    "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  }]
}]
```

The configuration file specifies that `index.js` is a serverless function and sets headers for access control. Additionally, it rewrites the path to make `index.js` executable.

## Usage

To use your GitHub CDN, follow this format:
```
https://<CDN>.vercel.app/<USER>/<REPO>/<PATH>
```

For example, the CDN link for [Vatch Lite](https://crestatic.vercel.app/creuserr/vatch/dist/vatch-lite.js) is:
```
https://crestatic.vercel.app/creuserr/vatch/dist/vatch-lite.js

CDN: crestatic
User: creuserr
Repo: vatch
Path: dist/vatch-lite.js
```

That's all for now!