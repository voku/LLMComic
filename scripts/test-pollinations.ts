import fs from 'fs';
import path from 'path';

async function test() {
  const prompt = encodeURIComponent("cyberpunk detective");
  const url = `https://image.pollinations.ai/prompt/${prompt}?model=flux`;
  const res = await fetch(url);
  console.log(res.status, res.headers.get('content-type'));
  console.log(await res.text());
}
test();