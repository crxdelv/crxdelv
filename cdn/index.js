export default function handler(request, response) {
  const user = request.query.user;
  const repo = request.query.repo;
  const  = request.query.name;
  return response.send(`Hello ${name}!`);
}