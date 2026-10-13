import { redirect } from "next/navigation";

// /demo with no booth picks the first cook team.
export default function DemoIndex() {
  redirect("/demo/1");
}
