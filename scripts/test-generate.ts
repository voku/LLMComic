async function run() {
  const genRes = await fetch('http://localhost:3000/api/generate-single', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'test', prompt: 'test' })
  });
  const genData = await genRes.json();
  console.log(genData);
}
run();
