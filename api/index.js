export default async function(request) {
  var url = new URL(_req.url);
  var user = url.searchParams.get("user");
  var repo = url.searchParams.get("user");
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