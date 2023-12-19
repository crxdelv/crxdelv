export default async function handler(request, response) {
  const user = request.query.user;
  const repo = request.query.repo;
  const path = request.query.path;
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  
  return response.send(`Hello ${name}!`);
}