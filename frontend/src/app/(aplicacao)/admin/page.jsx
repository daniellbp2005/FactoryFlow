import "./admin.css"
import {Globe} from "lucide-react"

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  return (
    <main>
        <Globe size={24}/>
    </main>
  );
}
