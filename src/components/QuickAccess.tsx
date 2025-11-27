import { useMemo, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Send,
  HelpCircle,
  CreditCard,
  FileText,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

type QuickAccessProps = {
  className?: string;
  onOpenCardManager?: () => void;
  onOpenExpenseTracker?: () => void;
  onOpenSupportHelp?: () => void;
  onOpenStatements?: () => void;
  heading?: string;
  subheading?: string;
  showCTA?: boolean;
};

type QuickAccessItem = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  action: () => void;
  iconBgClass: string;
  overlayClass: string;
  hoverIconColor: string;
};

const QuickAccess = ({
  className,
  onOpenCardManager,
  onOpenExpenseTracker,
  onOpenSupportHelp,
  onOpenStatements,
  heading = "Quick Access",
  subheading = "Jump into your most used actions",
  showCTA = true,
}: QuickAccessProps) => {
  const navigate = useNavigate();

  const items = useMemo<QuickAccessItem[]>(() => [
    {
      title: "Payments",
      description: "Send money and pay bills",
      icon: Send,
      action: () => navigate("/payments"),
      iconBgClass: "bg-gradient-to-br from-blue-500 to-blue-400",
      overlayClass: "bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-transparent",
      hoverIconColor: "group-hover:text-blue-500",
    },
    {
      title: "Support & Help",
      description: "Get help and find answers",
      icon: HelpCircle,
      action: onOpenSupportHelp || (() => navigate("/support")),
      iconBgClass: "bg-gradient-to-br from-orange-500 to-amber-400",
      overlayClass: "bg-gradient-to-br from-orange-500/15 via-amber-400/10 to-transparent",
      hoverIconColor: "group-hover:text-orange-500",
    },
    {
      title: "Card Management",
      description: "View and manage your debit & credit cards",
      icon: CreditCard,
      action: onOpenCardManager || (() => navigate("/dashboard")),
      iconBgClass: "bg-gradient-to-br from-purple-500 to-indigo-400",
      overlayClass: "bg-gradient-to-br from-purple-500/15 via-indigo-400/10 to-transparent",
      hoverIconColor: "group-hover:text-purple-500",
    },
    {
      title: "Statements",
      description: "View and download account statements",
      icon: FileText,
      action: onOpenStatements || (() => navigate("/dashboard")),
      iconBgClass: "bg-gradient-to-br from-emerald-500 to-green-400",
      overlayClass: "bg-gradient-to-br from-emerald-500/15 via-green-400/10 to-transparent",
      hoverIconColor: "group-hover:text-emerald-500",
    },
  ], [navigate, onOpenCardManager, onOpenSupportHelp, onOpenStatements]);

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--commerce-green)_/_0.15)] text-[hsl(var(--commerce-green))]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
            <p className="text-sm text-slate-500">{subheading}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card
            key={item.title}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_25px_40px_-20px_rgba(15,23,42,0.35)]"
            onClick={item.action}
          >
            <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100", item.overlayClass)} />
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:scale-105", item.iconBgClass)}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
                <ArrowUpRight className={cn("h-5 w-5 text-slate-400 transition-colors", item.hoverIconColor)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default QuickAccess;

