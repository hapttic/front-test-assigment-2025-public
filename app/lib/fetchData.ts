export async function fetchAnalyticsData() {
    const res = await fetch("/data.json", {
      cache: "no-store"  
    });
  
    if (!res.ok) throw new Error("Failed to load data.json");
  
    return res.json();
  }
  