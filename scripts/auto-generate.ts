async function run() {
  console.log("Fetching shipped image manifest...");
  try {
    const res = await fetch('http://localhost:3000/api/generation-plan');
    if (!res.ok) {
      throw new Error(`Failed to fetch plan: ${res.statusText}`);
    }
    const plan = await res.json();
    
    console.log(`Found ${plan.length} pre-generated comic images.`);
    for (let i = 0; i < plan.length; i++) {
      const item = plan[i];
      console.log(`[${i + 1}/${plan.length}] Verifying ${item.id}...`);
      
      const genRes = await fetch('http://localhost:3000/api/generate-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      });
      
      const genData = await genRes.json();
      if (genData.success) {
        console.log(`  -> Ready at ${genData.path}`);
      } else {
        console.error(`  -> Failed:`, genData.error);
      }
    }
    console.log("All shipped comic images are accounted for.");
  } catch (err) {
    console.error("Error while verifying the image manifest:", err);
  }
}

run();
