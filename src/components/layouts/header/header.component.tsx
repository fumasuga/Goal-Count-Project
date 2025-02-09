import { signout } from "@/app/actions/authAction";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex fixed w-[100vw] items-center h-[60px] px-4 border-b bg-white">
      <div className="flex-1 min-w-0">
        <ul className="grid grid-flow-col border-b border-gray-200 text-gray-600">
          <li className="pr-4 w-[120px]">
            <form>
              <button
                className="flex justify-center border-b-4 border-transparent hover:text-gray-900 hover:border-gray-900 py-4"
                formAction={signout}
              >
                Sign out
              </button>
            </form>
          </li>
        </ul>
      </div>
      <Button size="sm">
        <Link href="/goal/create/">Create New Goal</Link>
      </Button>
    </header>
  );
}
