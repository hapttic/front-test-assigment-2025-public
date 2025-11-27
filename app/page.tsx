import HomePage from "@/components/pageComponents/HomePage";
import QueryProvider from "../lib/providers/QueryProvider";

export default function Home() {
  return (
    <QueryProvider>
      <HomePage />
    </QueryProvider>
  );
}
