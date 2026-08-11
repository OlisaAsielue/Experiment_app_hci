import { PLACEHOLDER_TASK_SOURCES } from "@/content/placeholder-stimuli";

/**
 * SourcePanel — the task's reference source material.
 *
 * Rendered by the shared TaskScreen (NOT by either condition component), so both
 * conditions get identical access to the sources. Collapsible so it doesn't crowd
 * the AI output. Participants use it to write and verify their summary brief.
 */
export function SourcePanel() {
  return (
    <details className="group rounded-lg border border-neutral-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium text-neutral-700">
        <span>Task &amp; source material</span>
        <span className="text-neutral-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="space-y-3 border-t border-neutral-200 px-4 py-3">
        <p className="text-sm text-neutral-600">
          Read the four source excerpts below, then use the assistant to help you
          produce a short, verified summary brief.
        </p>
        <ul className="space-y-3">
          {PLACEHOLDER_TASK_SOURCES.map((s) => (
            <li key={s.id} className="rounded-md bg-neutral-50 p-3">
              <p className="text-xs font-semibold text-neutral-700">{s.title}</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-neutral-600">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
