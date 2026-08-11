import type { Metadata } from "next";
import { DemoFlow } from "@/components/flow/DemoFlow";

export const metadata: Metadata = {
  title: "Demo · Research Assistant",
  description:
    "Interactive demonstration of the interface-agency study apparatus.",
};

/**
 * /demo — the bare apparatus entry point (PRD §1a). No academic framing here; this
 * is the instrument itself. The client-side DemoFlow orchestrates the steps.
 */
export default function DemoPage() {
  return <DemoFlow />;
}
