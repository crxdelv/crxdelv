export default async function handler(request, response) {
  var user = request.query.user;
  var repo = request.query.repo;
  var path = request.query.path;
  var url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  try {
    var req = await fetch(url);
  }
  return response.send(`Hello ${name}!`);
}