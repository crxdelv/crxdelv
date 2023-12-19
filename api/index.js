export default async function(request) {
  
  var user = request.query.user;
  var repo = request.query.repo;
  var path = request.query.path;
  if(user == null || repo == null || path == null) return new Response("Error: incomplete parameter");
  var url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  try {
    var req = await fetch(url);
    var json = await req.json();
    return new Response(unescape(atob(json.content)));
  } catch(e) {
    return new Response(`Error: ${e}`);
  }
}