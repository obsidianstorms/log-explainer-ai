import ClientFactory from "./clients/ClientFactory.js";

// Simple
// const log = `cannot read property 'map' of undefined`;

// Multi-line
// const log = `
// Error: Cannot read property 'map' of undefined
//     at processData (/app/utils.js:42:15)
// `;

// Edge case
const log = `
2026-05-04T12:00:01.001Z INFO  [auth-service] req_id=abc123 user=42 action=login status=START
2026-05-04T12:00:01.002Z WARN  [auth-service] req_id=abc123 user=42 msg="password attempt failed" retry=1
2026-05-04T11:59:59.999Z INFO  [auth-service] req_id=abc123 user=42 action=login status=SUCCESS latency_ms=-3
`;

// 2026-05-04T12:00:01.100Z DEBUG [cache] key="user:42:profile" op=GET hit=true ttl=0
// 2026-05-04T12:00:01.101Z DEBUG [cache] key="user:42:profile" op=GET hit=true ttl=-15

// 2026-05-04T12:00:01.200Z ERROR [db] conn_id=77 query="SELECT * FROM orders WHERE id=?" params="[null]" err="invalid input syntax for type integer: \"\""
// 2026-05-04T12:00:01.200Z ERROR [db] conn_id=77 query="SELECT * FROM orders WHERE id=?" params="[\"\"]" err="invalid input syntax for type integer: \"\""

// 2026-05-04T12:00:01.300Z INFO  [worker-1] job_id=job-9 state=START
// 2026-05-04T12:00:01.300Z INFO  [worker-2] job_id=job-9 state=START   # duplicate consumer?
// 2026-05-04T12:00:01.301Z INFO  [worker-1] job_id=job-9 state=COMPLETE duration_ms=0
// 2026-05-04T12:00:01.302Z ERROR [worker-2] job_id=job-9 state=FAIL err="already completed"

// 2026-05-04T12:00:01.400Z INFO  [api] req_id=def456 path="/upload" bytes=1048576 status=200
// 2026-05-04T12:00:01.401Z INFO  [api] req_id=def456 path="/upload" bytes=0 status=200   # partial overwrite?

// 2026-05-04T12:00:01.500Z WARN  [fs] path="/tmp/data.bin" op=write bytes=512 result=OK
// 2026-05-04T12:00:01.501Z WARN  [fs] path="/tmp/data.bin" op=write bytes=∞ result=OK   # invalid numeric

// 2026-05-04T12:00:01.600Z INFO  [i18n] locale="tr_TR" input="FILE" lower="fıle"  # Turkish ‘i’ edge case
// 2026-05-04T12:00:01.601Z INFO  [i18n] locale="en_US" input="FILE" lower="file"

// 2026-05-04T12:00:01.700Z ERROR [json] payload="{\"user\":42, \"name\":\"Alice\",}" err="trailing comma"
// 2026-05-04T12:00:01.701Z ERROR [json] payload="{\"user\":42 \"name\":\"Alice\"}" err="missing comma"

// 2026-05-04T12:00:01.800Z INFO  [metrics] cpu=NaN mem=+Inf disk=-Inf

// 2026-05-04T12:00:01.900Z INFO  [scheduler] next_run="2026-02-30T00:00:00Z"  # invalid date
// 2026-05-04T12:00:02.000Z INFO  [scheduler] next_run="1970-01-01T00:00:00Z"  # epoch fallback?

// 2026-05-04T12:00:02.100Z DEBUG [net] peer="10.0.0.1:443" tls_version="TLS1.3" sni=""
// 2026-05-04T12:00:02.101Z WARN  [net] peer="10.0.0.1:443" tls_version="TLS1.3" sni=null

// 2026-05-04T12:00:02.200Z INFO  [auth-service] req_id=ghi789 user=007 action=login status=SUCCESS
// 2026-05-04T12:00:02.201Z INFO  [auth-service] req_id=ghi789 user=7 action=login status=SUCCESS  # leading zero ambiguity

// 2026-05-04T12:00:02.300Z ERROR [parser] line="2026-05-04T12:00:02Z \xC3\x28" err="invalid UTF-8 sequence"

// 2026-05-04T12:00:02.400Z INFO  [clock] source="ntp" offset_ms=+5000 applied=true
// 2026-05-04T12:00:02.401Z INFO  [clock] source="system" offset_ms=-5000 applied=true  # conflicting adjustments

// 2026-05-04T12:00:02.500Z INFO  [queue] msg_id=xyz ack=true
// 2026-05-04T12:00:02.501Z INFO  [queue] msg_id=xyz ack=true  # duplicate ack

// 2026-05-04T12:00:02.600Z ERROR [oom] process="worker-3" rss_mb=2048 limit_mb=1024 action="killed"
// 2026-05-04T12:00:02.601Z INFO  [worker-3] state=HEALTHY  # zombie/late heartbeat?

// 2026-05-04T12:00:02.700Z INFO  [feature-flag] flag="new_checkout" user=42 enabled=true
// 2026-05-04T12:00:02.701Z INFO  [feature-flag] flag="new_checkout" user=42 enabled=false  # inconsistent eval

// 2026-05-04T12:00:02.800Z INFO  [trace] trace_id=abc span_id=1 parent_id=null
// 2026-05-04T12:00:02.801Z INFO  [trace] trace_id=abc span_id=1 parent_id=1  # self-parent cycle

// 2026-05-04T12:00:02.900Z INFO  [billing] amount="19.99" currency="USD"
// 2026-05-04T12:00:02.901Z INFO  [billing] amount=19,99 currency="USD"  # locale decimal comma

// 2026-05-04T12:00:03.000Z FATAL [kernel] panic="double free or corruption"
// <<TRUNCATED LINE WITHOUT NEWLINE
// 2026-05-04T12:00:03.100Z INFO  [recovery] step=1 status=START


(async () => {
  const client = ClientFactory();

  const response = await client.generate({ input: log });
  
  console.log("Response:\n", response);
})();
