import Link from "next/link";
import { AnalyticsPanel, BaseContentLayer } from "@/components";

export default function NotFound() {
  return (
    <div className="workflow-shell">
      <BaseContentLayer title="Page not found" kicker="Trust Trainer">
        <p>This route is not part of the demo path.</p>
      </BaseContentLayer>
      <AnalyticsPanel title="Return to demo" kicker="Navigation">
        <Link className="button button--primary button--md" href="/submit">
          Start safety check
        </Link>
      </AnalyticsPanel>
    </div>
  );
}
