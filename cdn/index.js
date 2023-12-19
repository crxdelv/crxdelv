export default async function handler(request, response) {
  var user = request.query.user;
  var repo = request.query.repo;
  var path = request.query.path;
  if(user == null || repo == null || path == null) return response.status(400).send("Error: the parameters user, repo, path, are required.");
  var url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  try {
    var req = await fetch(url);
    var json = await req.json();
    return response.send(unescape(atob(json.content)));
  } catch(e) {
    return response.status(400).send(`Error: ${e}`);
  }
}