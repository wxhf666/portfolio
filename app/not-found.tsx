import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          页面未找到
        </h1>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
          你访问的页面不存在或已被移除。
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
