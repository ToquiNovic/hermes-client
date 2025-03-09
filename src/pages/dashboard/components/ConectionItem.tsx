import { BentoGridItem } from "@/components/ui/bento-grid";
import { Columns, Copy } from "lucide-react";

const ConectionItem = () => {
  const supabaseUrl = "https://wzgqxiidibfdmftbnjxv.supabase.co";
  const supabaseKey = "eyJhbG... (anon public)";

  return (
    <BentoGridItem
      title="Supabase Connection"
      description="Your API is secured behind an API gateway which requires an API Key for every request."
      header={
        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2] text-sm">
          <p className="font-bold text-neutral-800 dark:text-white">Project API</p>

          <div className="mt-3">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">Project URL</p>
            <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 p-2 rounded justify-between">
              <span className="truncate">{supabaseUrl}</span>
              <Copy className="h-4 w-4 text-neutral-500 cursor-pointer" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">API Key (anon public)</p>
            <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 p-2 rounded justify-between">
              <span className="truncate">{supabaseKey}</span>
              <Copy className="h-4 w-4 text-neutral-500 cursor-pointer" />
            </div>
          </div>
        </div>
      }
      className="md:col-span-2"
      icon={<Columns className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default ConectionItem;
