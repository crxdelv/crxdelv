export default function handler(request, response) {
  const user = request.query.user;
  const repo = request.query.repo;
  const path = request.query.path;
  return response.send(`Hello ${name}!`);
}