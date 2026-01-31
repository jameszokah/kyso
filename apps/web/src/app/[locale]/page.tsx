import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      Home Page
      <div className="flex justify-center">
        <Button asChild> <Link href="/dashboard">Dashboard</Link></Button>
      </div>
    </div>
  );
}
