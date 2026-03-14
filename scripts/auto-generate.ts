async function run() {
  console.log("Fetching generation plan...");
  try {
    const res = await fetch('http://localhost:3000/api/generation-plan');
    if (!res.ok) {
      throw new Error(`Failed to fetch plan: ${res.statusText}`);
    }
    const plan = await res.json();
    
    console.log(`Found ${plan.length} images to generate.`);
    for (let i = 0; i < plan.length; i++) {
      const item = plan[i];
      console.log(`[${i+1}/${plan.length}] Generating ${item.id}...`);
      
      const genRes = await fetch('http://localhost:3000/api/generate-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      
      const genData = await genRes.json();
      if (genData.success) {
        console.log(`  -> Success ${genData.cached ? '(Cached)' : ''}`);
      } else {
        console.error(`  -> Failed:`, genData.error);
      }
    }
    console.log("All done!");
  } catch (err) {
    console.error("Error during generation:", err);
  }
}

run();
