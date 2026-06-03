export async function GET() {
  return Response.json({
    ok: true,
    service: "sm-dream-properties",
    timestamp: new Date().toISOString(),
  });
}
