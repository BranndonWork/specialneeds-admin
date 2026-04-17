export const config = {
  runtime: 'experimental-edge',
};

export default function handler() {
  return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
