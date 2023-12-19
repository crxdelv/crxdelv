export default async function(request) {
  var url = new URL(request.url);
  var user = url.searchParams.get("user");
  var repo = url.searchParams.get("repo");
  var path = url.searchParams.get("path");
  if(user == null || repo == null || path == null) return new Response("Error: incomplete parameter");
  var url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  try {
    var req = await fetch(url);
    var json = await req.json();
    var content = unescape(atob(json.content));
    return new Response(content);
  } catch(e) {
    return new Response(`Error: ${e}`);
  }
}