import type { Env } from "../env";

interface RateState {
  tokens: number;
  lastRefill: number;
}

export class RateLimiterDO {
  state: DurableObjectState;
  env: Env;
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/acquire") {
      return new Response("Not found", { status: 404 });
    }
    const rate = Number(url.searchParams.get("rate") ?? "1");
    const burst = Number(url.searchParams.get("burst") ?? "5");
    const now = Date.now();

    const stored = (await this.state.storage.get<RateState>("state")) ?? {
      tokens: burst,
      lastRefill: now
    };
    const elapsed = Math.max(0, now - stored.lastRefill) / 1000;
    const refill = elapsed * rate;
    const tokens = Math.min(burst, stored.tokens + refill);

    const allowed = tokens >= 1;
    const newState: RateState = {
      tokens: allowed ? tokens - 1 : tokens,
      lastRefill: now
    };
    await this.state.storage.put("state", newState);

    return new Response(JSON.stringify({ allowed, tokens: newState.tokens }), {
      headers: { "content-type": "application/json" }
    });
  }
}
