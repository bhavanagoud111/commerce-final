import { toast } from "@/components/ui/use-toast";

type NotifyOptions = {
  title: string;
  description?: string;
};

const notify = ({ title, description }: NotifyOptions, variant: "default" | "destructive" = "default") => {
  toast({
    variant,
    title,
    description,
  });
};

export const notifySuccess = (options: NotifyOptions) => notify(options, "default");
export const notifyInfo = (options: NotifyOptions) => notify(options, "default");
export const notifyError = (options: NotifyOptions) => notify(options, "destructive");

